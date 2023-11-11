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

import { readFile, rm, stat } from 'fs/promises';
import * as http from 'http';
import type { AddressInfo } from 'net';
import { join as joinPath } from 'path';
import { dir as tmpDir, DirOptions as TmpDirOptions } from 'tmp';

import { downloadFile, generate, GenerateResults } from './config_gen';

describe('generate', () => {
  describe('public mirror', () => {
    let results: GenerateResults;
    beforeAll(async () => {
      results = await generate({
        substituters: ['https://cache.example.com'],
      });
    });
    afterAll(async () => {
      if (results.tempDir) {
        await rm(results.tempDir, { recursive: true, force: true });
      }
    });

    it('contains a substituters line', () => {
      const lines = results.config.split('\n');
      expect(lines).toContain('extra-substituters = https://cache.example.com');
    });

    it('does not create a directory', () => {
      expect(results.tempDir).toBeNull();
    });
  });

  describe('public cache', () => {
    let results: GenerateResults;
    beforeAll(async () => {
      results = await generate({
        substituters: ['https://cache.example.com'],
        trustedPublicKeys: ['example-1:xyzzy'],
      });
    });
    afterAll(async () => {
      if (results.tempDir) {
        await rm(results.tempDir, { recursive: true, force: true });
      }
    });

    it('contains a substituters line', () => {
      const lines = results.config.split('\n');
      expect(lines).toContain('extra-substituters = https://cache.example.com');
    });

    it('contains a trusted-public-keys line', () => {
      const lines = results.config.split('\n');
      expect(lines).toContain('extra-trusted-public-keys = example-1:xyzzy');
    });

    it('does not create a directory', () => {
      expect(results.tempDir).toBeNull();
    });
  });

  describe('secret keys', () => {
    let results: GenerateResults;
    beforeAll(async () => {
      results = await generate({
        substituters: ['https://cache.example.com'],
        secretKeys: ['example-1:sekret'],
      });
    });
    afterAll(async () => {
      if (results.tempDir) {
        await rm(results.tempDir, { recursive: true, force: true });
      }
    });

    it('contains a substituters line', () => {
      const lines = results.config.split('\n');
      expect(lines).toContain('extra-substituters = https://cache.example.com');
    });

    it('creates a secret key file', async () => {
      const prefix = 'extra-secret-key-files = ';
      const secretKeyLines = results.config
        .split('\n')
        .filter((line) => line.startsWith(prefix));
      expect(secretKeyLines).toHaveLength(1);
      const path = secretKeyLines[0].substring(prefix.length);
      const keyData = await readFile(path, { encoding: 'utf-8' });
      expect(keyData).toEqual('example-1:sekret');
    });

    it('sets a post-build-hook', async () => {
      const lines = results.config.split('\n');
      expect(lines).toContainEqual(expect.stringMatching(/^post-build-hook =/));
    });

    it('post-build-hook contains substituter', async () => {
      const prefix = 'post-build-hook = ';
      const postBuildHookLines = results.config
        .split('\n')
        .filter((line) => line.startsWith(prefix));
      expect(postBuildHookLines.length).toBeGreaterThan(0);
      const path = postBuildHookLines[0].substring(prefix.length);
      const hookScript = await readFile(path, { encoding: 'utf-8' });
      expect(hookScript).toEqual(
        expect.stringContaining('https://cache.example.com'),
      );
    });
  });

  describe('S3 cache', () => {
    let results: GenerateResults;
    beforeAll(async () => {
      results = await generate({
        substituters: ['s3://example-bucket'],
        secretKeys: ['example-1:sekret'],
        awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        awsSecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      });
    });
    afterAll(async () => {
      if (results.tempDir) {
        await rm(results.tempDir, { recursive: true, force: true });
      }
    });

    it('contains a substituters line', () => {
      const lines = results.config.split('\n');
      expect(lines).toContain('extra-substituters = s3://example-bucket');
    });

    it('stores AWS credentials', async () => {
      expect(results.credsPath).toBeTruthy();
      const credsData = await readFile(results.credsPath!, {
        encoding: 'utf-8',
      });
      expect(credsData).toEqual(
        '[default]\n' +
          'aws_access_key_id = AKIAIOSFODNN7EXAMPLE\n' +
          'aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n',
      );
    });

    it('post-build-hook contains credentials path', async () => {
      expect(results.credsPath).toBeTruthy();
      const prefix = 'post-build-hook = ';
      const postBuildHookLines = results.config
        .split('\n')
        .filter((line) => line.startsWith(prefix));
      expect(postBuildHookLines).toHaveLength(1);
      const path = postBuildHookLines[0].substring(prefix.length);
      const hookScript = await readFile(path, { encoding: 'utf-8' });
      expect(hookScript).toEqual(expect.stringContaining(results.credsPath!));
    });
  });
});

describe('downloadFile', () => {
  const dummyContent = 'Hello, World!\n';
  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    const u = new URL(req.url, `http://${req.headers.host}`);
    switch (u.pathname) {
      case '/200':
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': dummyContent.length,
        });
        res.end(dummyContent);
        break;
      case '/204':
        res.writeHead(204);
        res.end();
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        break;
    }
  });

  let serverUrl: string;
  beforeAll(async () => {
    serverUrl = await new Promise<string>((resolve) => {
      server.listen(() => {
        const addr = server.address() as AddressInfo;
        resolve(`http://localhost:${addr.port}`);
      });
    });
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  let tempDir: string;
  beforeAll(async () => {
    tempDir = await new Promise<string>((resolve, reject) => {
      const options: TmpDirOptions = {
        prefix: 'setup-nix-cache-action-test',
      };
      tmpDir(options, (err, name) => {
        if (err) {
          reject(err);
        } else {
          resolve(name);
        }
      });
    });
  });
  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('200', () => {
    let got: string;
    let dstPath: string;
    beforeAll(async () => {
      dstPath = joinPath(tempDir, '200');
      got = await downloadFile(dstPath, serverUrl + '/200');
    });

    it('created a file', async () => {
      const info = await stat(dstPath);
      expect(info.isFile()).toBe(true);
      expect(info.size).toEqual(dummyContent.length);
    });

    it('returned the expected hash', () => {
      expect(got).toEqual(
        'c98c24b677eff44860afea6f493bbaec5bb1c4cbb209c6fc2bbb47f66ff2ad31',
      );
    });

    it('wrote the correct content to the file', async () => {
      const got = await readFile(dstPath, 'utf-8');
      expect(got).toEqual(dummyContent);
    });
  });

  describe('204', () => {
    let got: string;
    let dstPath: string;
    beforeAll(async () => {
      dstPath = joinPath(tempDir, '204');
      got = await downloadFile(dstPath, serverUrl + '/204');
    });

    it('created a zero-length file', async () => {
      const info = await stat(dstPath);
      expect(info.isFile()).toBe(true);
      expect(info.size).toEqual(0);
    });

    it('returned the expected hash', () => {
      expect(got).toEqual(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
    });
  });

  describe('404', () => {
    it('throws an error', async () => {
      const dstPath = joinPath(tempDir, '404');
      await expect(
        downloadFile(dstPath, serverUrl + '/404'),
      ).rejects.toBeTruthy();
    });
  });
});
