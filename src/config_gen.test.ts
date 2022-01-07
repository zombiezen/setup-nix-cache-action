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

import { readFile, rm } from 'fs/promises';

import { generate, GenerateResults } from './config_gen';

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
      const secretKeyLines = results.config.split('\n')
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
      const postBuildHookLines = results.config.split('\n')
        .filter((line) => line.startsWith(prefix));
      expect(postBuildHookLines.length).toBeGreaterThan(0);
      const path = postBuildHookLines[0].substring(prefix.length);
      const hookScript = await readFile(path, { encoding: 'utf-8' });
      expect(hookScript).toEqual(expect.stringContaining('https://cache.example.com'));
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
      const credsData = await readFile(results.credsPath!, { encoding: 'utf-8' });
      expect(credsData).toEqual('[default]\n' +
        'aws_access_key_id = AKIAIOSFODNN7EXAMPLE\n' +
        'aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n');
    });

    it('post-build-hook contains credentials path', async () => {
      expect(results.credsPath).toBeTruthy();
      const prefix = 'post-build-hook = ';
      const postBuildHookLines = results.config.split('\n')
        .filter((line) => line.startsWith(prefix));
      expect(postBuildHookLines).toHaveLength(1);
      const path = postBuildHookLines[0].substring(prefix.length);
      const hookScript = await readFile(path, { encoding: 'utf-8' });
      expect(hookScript).toEqual(expect.stringContaining(results.credsPath!));
    });
  });
});
