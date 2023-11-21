// @ts-check

// Copyright 2023 Ross Light
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

import { createHash } from 'node:crypto';
import * as process from 'node:process';

import { getOctokit } from '@actions/github';
import fetch from 'node-fetch';

const QUERY = `
query ($tagName: String!) {
  repository(owner: "zombiezen", name: "nixcached") {
    release(tagName: $tagName) {
      releaseAssets(first: 50) {
        nodes {
          name
          downloadUrl
        }
      }
    }
  }
}
`;

/**
 *
 * @param {string} url
 * @returns {Promise<string>} The SHA-256 hash
 */
async function hashUrl(url) {
  const hasher = createHash('sha256');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} ${response.status}`);
  }
  if (!response.body) {
    return hasher.digest('hex');
  }

  response.body.pipe(hasher);

  return new Promise((resolve) => {
    hasher.on('finish', () => {
      resolve(hasher.digest('hex'));
    });
  });
}

(async () => {
  const octokit = getOctokit(process.env.GITHUB_TOKEN ?? '');

  const {
    repository: {
      release: {
        releaseAssets: { nodes: releaseAssets },
      },
    },
  } = await octokit.graphql(QUERY, {
    tagName: process.argv[2],
  });

  /** @type {Record<string, Record<string, { url: string; sha256: string }>>} */
  const result = {};

  for (const asset of releaseAssets) {
    /** @type {{name: string, downloadUrl: string}} */
    const { name, downloadUrl } = asset;
    /** @type {{os: string, arch: string}} */
    let platform;
    if (name.endsWith('-linux_amd64')) {
      platform = { os: 'linux', arch: 'x64' };
    } else if (name.endsWith('-linux_arm64')) {
      platform = { os: 'linux', arch: 'arm64' };
    } else if (name.endsWith('-darwin_amd64')) {
      platform = { os: 'darwin', arch: 'x64' };
    } else if (name.endsWith('-darwin_arm64')) {
      platform = { os: 'darwin', arch: 'arm64' };
    } else {
      continue;
    }

    result[platform.os] = result[platform.os] || {};
    result[platform.os][platform.arch] = {
      url: downloadUrl,
      sha256: await hashUrl(downloadUrl),
    };
  }

  /** @type {Promise<void>} */
  const writePromise = new Promise((resolve, reject) => {
    process.stdout.write(JSON.stringify(result, undefined, 2) + '\n', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await writePromise;
})();
