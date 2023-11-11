// Copyright 2022 Ross Light
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

import { debug, warning } from '@actions/core';
import { createHash } from 'crypto';
import { createWriteStream } from 'fs';
import type { PathLike } from 'fs';
import { chmod, rm, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import * as path from 'path';
import { platform, arch } from 'process';
import { dir as tmpDir, DirOptions as TmpDirOptions } from 'tmp';
import { runCommand } from './common';

export interface GenerateInput {
  substituters: string[];
  trustedPublicKeys?: string[];
  secretKeys?: string[];
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  useNixcached?: boolean;
}

export interface GenerateResults {
  config: string;
  tempDir: string | null;
  credsPath: string | null;
  /** Path to a nixcached executable. */
  nixcachedExe: string | null;
  /** Path to the nixcached upload pipe. */
  nixcachedPipe: string | null;
}

const nixcachedBinaries: {
  [K in NodeJS.Platform]?: Record<string, { url: string; sha256: string }>;
} = {
  linux: {
    x64: {
      url: 'https://github.com/zombiezen/nixcached/releases/download/v0.2.0/nixcached-0.2.0-linux_amd64',
      sha256:
        '42c51ac60654128f834fdbea1f24fbc4c479bbccb6371c9bade2e8a9a712de20',
    },
    arm64: {
      url: 'https://github.com/zombiezen/nixcached/releases/download/v0.2.0/nixcached-0.2.0-linux_arm64',
      sha256:
        'a054e7614731b1396621c66fef54fee85709b91f77fe7f1b71edb30a98079f32',
    },
  },
  darwin: {
    x64: {
      url: 'https://github.com/zombiezen/nixcached/releases/download/v0.2.0/nixcached-0.2.0-darwin_amd64',
      sha256:
        '8699172b2caf4315f9c61c78779b31dabb474f292b4eb56ddf72f6381a849a45',
    },
    arm64: {
      url: 'https://github.com/zombiezen/nixcached/releases/download/v0.2.0/nixcached-0.2.0-darwin_arm64',
      sha256:
        '6832535a7bc3aab5db482d697d2f4e8c014307412411762e7907b20bc9c73fe7',
    },
  },
};

export async function generate(input: GenerateInput): Promise<GenerateResults> {
  const {
    substituters,
    trustedPublicKeys,
    secretKeys,
    awsAccessKeyId,
    awsSecretAccessKey,
    useNixcached,
  } = input;

  let config = 'extra-substituters = ' + substituters.join(' ') + '\n';
  if (trustedPublicKeys) {
    config +=
      'extra-trusted-public-keys = ' + trustedPublicKeys.join(' ') + '\n';
  }

  let tempDir: string | null = null;
  let credsPath: string | null = null;
  let nixcachedExe: string | null = null;
  let nixcachedPipe: string | null = null;
  try {
    const hasAwsKey = awsAccessKeyId && awsSecretAccessKey;
    if (secretKeys || hasAwsKey || useNixcached) {
      tempDir = await new Promise<string>((resolve, reject) => {
        const options: TmpDirOptions = {
          keep: true,
          prefix: 'setup-nix-cache-action',
          mode: 0o755,
        };
        tmpDir(options, (err, name) => {
          if (err) {
            reject(err);
          } else {
            resolve(name);
          }
        });
      });

      if (useNixcached) {
        const binariesForPlatform = nixcachedBinaries[platform];
        const binaryInfo = binariesForPlatform
          ? binariesForPlatform[arch]
          : undefined;
        if (!binaryInfo) {
          throw new Error(`nixcached not supported on ${platform}/${arch}`);
        }
        nixcachedExe = path.join(tempDir, 'nixcached');
        debug(`Downloading ${binaryInfo.url} to ${nixcachedExe}`);
        const gotSha256 = await downloadFile(nixcachedExe, binaryInfo.url);
        if (gotSha256 != binaryInfo.sha256) {
          throw new Error(
            `nixcached binary at ${binaryInfo.url} does not match expected hash`,
          );
        }
        debug(`Successfully downloaded ${binaryInfo.url}`);
        await chmod(nixcachedExe, 0o755);

        nixcachedPipe = path.join(tempDir, 'nixcached-upload-pipe');
        debug(`mkfifo ${nixcachedPipe}`);
        await runCommand(['mkfifo', nixcachedPipe]);
      }

      if (hasAwsKey) {
        credsPath = path.join(tempDir, 'aws-credentials');
        await writeFile(
          credsPath,
          `[default]
aws_access_key_id = ${awsAccessKeyId}
aws_secret_access_key = ${awsSecretAccessKey}
`,
          { mode: 0o600 },
        );
        debug('Wrote ' + credsPath);
      }

      if (secretKeys) {
        const keyFiles = [];
        for (let i = 0; i < secretKeys.length; i++) {
          const k = secretKeys[i];
          const keyPath = path.join(tempDir, 'secret-key' + i);
          await writeFile(keyPath, k, { mode: 0o600 });
          debug('Wrote ' + keyPath);
          keyFiles.push(keyPath);
        }
        config += 'extra-secret-key-files = ' + keyFiles.join(' ') + '\n';

        let hook = `#!/bin/bash
set -euo pipefail
echo "Uploading paths: $OUT_PATHS" 1>&2
`;
        if (useNixcached) {
          hook += `echo "$OUT_PATHS" | xargs '${nixcachedExe}' send --output='${nixcachedPipe}' 1>&2`;
        } else {
          if (hasAwsKey) {
            hook += `export AWS_SHARED_CREDENTIALS_FILE='${credsPath}'` + '\n';
          }
          hook += `echo "$OUT_PATHS" | xargs /nix/var/nix/profiles/default/bin/nix \\
    --extra-experimental-features nix-command \\
    copy --to '${substituters[0]}' 1>&2
  `;
        }
        const hookPath = path.join(tempDir, 'post-build-hook');
        await writeFile(hookPath, hook, { mode: 0o755 });
        debug('Wrote ' + hookPath);
        config += 'post-build-hook = ' + hookPath + '\n';
      }
    }
    return { config, tempDir, credsPath, nixcachedExe, nixcachedPipe };
  } catch (e) {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch((e) => {
        warning(e);
      });
    }
    throw e;
  }
}

/**
 * Downloads a URL and writes its content to the given file
 * while also hashing it.
 *
 * @returns The hex-encoded SHA-256 hash of the file.
 */
export async function downloadFile(
  dstPath: PathLike,
  url: string,
): Promise<string> {
  const hasher = createHash('sha256');
  const file = createWriteStream(dstPath);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} ${response.status}`);
  }
  if (!response.body) {
    await new Promise<void>((resolve, reject) => {
      file.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return hasher.digest('hex');
  }

  response.body.pipe(hasher);
  response.body.pipe(file);

  return new Promise<string>((resolve, reject) => {
    file.on('error', (err) => {
      file.close(() => {
        reject(err);
      });
    });
    response.body!.on('error', (err) => {
      file.close(() => {
        reject(err);
      });
    });

    let finishes = 0;
    const finishCallback = () => {
      finishes++;
      if (finishes === 2) {
        resolve(hasher.digest('hex'));
      }
    };
    file.on('finish', finishCallback);
    hasher.on('finish', finishCallback);
  });
}
