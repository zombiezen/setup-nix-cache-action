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
import { rm, writeFile } from 'fs/promises';
import * as path from 'path';
import { dir as tmpDir, DirOptions as TmpDirOptions } from 'tmp';

export interface GenerateInput {
  substituters: string[];
  trustedPublicKeys?: string[];
  secretKeys?: string[];
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

export interface GenerateResults {
  config: string;
  tempDir: string | null;
  credsPath: string | null;
}

export async function generate(input: GenerateInput): Promise<GenerateResults> {
  const {
    substituters,
    trustedPublicKeys,
    secretKeys,
    awsAccessKeyId,
    awsSecretAccessKey,
  } = input;

  let config = 'extra-substituters = ' + substituters.join(' ') + '\n';
  if (trustedPublicKeys) {
    config += 'extra-trusted-public-keys = ' + trustedPublicKeys.join(' ') + '\n';
  }

  let tempDir: string | null = null;
  let credsPath: string | null = null;
  try {
    const hasAwsKey = awsAccessKeyId && awsSecretAccessKey;
    if (secretKeys || hasAwsKey) {
      tempDir = await new Promise<string>((resolve, reject) => {
        const options: TmpDirOptions = {
          keep: true,
          prefix: 'setup-nix-cache-action',
        };
        tmpDir(options, (err, name) => {
          if (err) {
            reject(err);
          } else {
            resolve(name);
          }
        });
      })

      if (hasAwsKey) {
        credsPath = path.join(tempDir, 'aws-credentials');
        await writeFile(credsPath, `[default]
aws_access_key_id = ${awsAccessKeyId}
aws_secret_access_key = ${awsSecretAccessKey}
`, { mode: 0o600 });
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
        if (hasAwsKey) {
          hook += `export AWS_SHARED_CREDENTIALS_FILE='${credsPath}'` + '\n';
        }
        hook += `echo "$OUT_PATHS" | xargs /nix/var/nix/profiles/default/bin/nix \\
  --extra-experimental-features nix-command \\
  copy --to '${substituters[0]}' 1>&2
`;
        const hookPath = path.join(tempDir, 'post-build-hook');
        await writeFile(hookPath, hook, { mode: 0o755 });
        debug('Wrote ' + hookPath);
        config += 'post-build-hook = ' + hookPath + '\n';
      }
    }
    return { config, tempDir, credsPath };
  } catch (e) {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch((e) => {
        warning(e);
      });
    }
    throw e;
  }
}
