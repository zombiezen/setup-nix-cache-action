/**
@license
Copyright 2022 Ross Light

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
**/

import { getInput, info, saveState, setFailed } from '@actions/core';
import { spawn } from 'child_process';
import { stat } from 'fs/promises';
import { platform } from 'process';

import { runRootCommand, SYSTEMD_DROPIN_STATE, TEMP_DIR_STATE } from './common';
import { generate } from './config_gen';

async function writeAsRoot(
  dstFile: string,
  data: string,
  options?: { append?: boolean },
): Promise<void> {
  const argv = options?.append ? ['tee', '-a', dstFile] : ['tee', dstFile];
  const proc = spawn('sudo', argv, {
    stdio: ['pipe', 'ignore', 'inherit'],
  });
  const exitPromise = new Promise<void>((resolve, reject) => {
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('tee exited with ' + code));
      }
    });
  });
  try {
    await new Promise<void>((resolve, reject) => {
      proc.stdin.write(data, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
    await new Promise<void>((resolve) => {
      proc.stdin.end(resolve);
    });
  } catch (e) {
    proc.kill();
    throw e;
  } finally {
    await exitPromise;
  }
}

async function restartNixDaemon(): Promise<void> {
  if (platform === 'linux') {
    const hasDaemon = await runRootCommand(
      ['systemctl', 'cat', 'nix-daemon.service'],
      { ignoreStderr: true },
    ).then(() => true, () => false);
    if (!hasDaemon) {
      return;
    }
    info('Restarting Nix daemon...');
    await runRootCommand(['systemctl', 'daemon-reload']);
    await runRootCommand(['systemctl', 'restart', 'nix-daemon.service']);
  } else if (platform === 'darwin') {
    const hasDaemon = await stat('/Library/LaunchDaemons/org.nixos.nix-daemon.plist')
      .then(() => true, () => false);
    if (!hasDaemon) {
      return;
    }
    info('Restarting Nix daemon...');
    await runRootCommand(['launchctl', 'kickstart', '-k', 'system/org.nixos.nix-daemon']);
  } else {
    throw new Error('cannot restart Nix daemon on unknown platform ' + platform);
  }
}

function spaceSepList(s: string): string[] {
  s = s.trim();
  return s ? s.split(/\s+/) : [];
}

(async () => {
  try {
    info('Generating configuration...');
    const { config: newConfig, tempDir, credsPath } = await generate({
      substituters: spaceSepList(getInput('substituters', { required: true })),
      trustedPublicKeys: spaceSepList(getInput('trusted_public_keys')),
      secretKeys: spaceSepList(getInput('secret_keys')),
      awsAccessKeyId: getInput('aws_access_key_id'),
      awsSecretAccessKey: getInput('aws_secret_access_key'),
    });
    if (tempDir) {
      runRootCommand(['chown', '-R', 'root:root', tempDir]);
      saveState(TEMP_DIR_STATE, tempDir);
    }
    info('Saving configuration...');
    await runRootCommand(['mkdir', '-p', '/etc/nix']);
    await writeAsRoot('/etc/nix/nix.conf', newConfig, { append: true });
    if (credsPath && platform === 'linux') {
      if (platform !== 'linux') {
        // TODO(darwin): launchctl equivalent?
        throw new Error('Private substituters not supported on ' + platform);
      }
      await runRootCommand(['mkdir', '-p', '/etc/systemd/system/nix-daemon.service.d']);
      const dropinPath = '/etc/systemd/system/nix-daemon.service.d/aws-credentials.conf';
      await writeAsRoot(
        dropinPath,
        '[Service]\n' +
          'Environment=AWS_SHARED_CREDENTIALS_FILE=' + credsPath + '\n',
      );
      saveState(SYSTEMD_DROPIN_STATE, dropinPath);
    }

    await restartNixDaemon();
    info('Done!');
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed(error + '');
    }
  }
})();
