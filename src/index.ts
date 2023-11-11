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

import {
  debug,
  getBooleanInput,
  getInput,
  info,
  saveState,
  setFailed,
} from '@actions/core';
import { spawn } from 'child_process';
import { stat } from 'fs/promises';
import { platform } from 'process';

import {
  runCommand,
  runRootCommand,
  SERVICES_STATE,
  SYSTEMD_DROPIN_STATE,
  TEMP_DIR_STATE,
} from './common';
import { generate } from './config_gen';

async function writeAsRoot(
  dstFile: string,
  data: string,
  options?: { append?: boolean },
): Promise<void> {
  const argv = options?.append
    ? ['--non-interactive', 'tee', '-a', dstFile]
    : ['--non-interactive', 'tee', dstFile];
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
    ).then(
      () => true,
      () => false,
    );
    if (!hasDaemon) {
      return;
    }
    info('Restarting Nix daemon...');
    await runRootCommand(['systemctl', 'daemon-reload']);
    await runRootCommand(['systemctl', 'restart', 'nix-daemon.service']);
  } else if (platform === 'darwin') {
    const hasDaemon = await stat(
      '/Library/LaunchDaemons/org.nixos.nix-daemon.plist',
    ).then(
      () => true,
      () => false,
    );
    if (!hasDaemon) {
      return;
    }
    info('Restarting Nix daemon...');
    await runRootCommand([
      'launchctl',
      'kickstart',
      '-k',
      'system/org.nixos.nix-daemon',
    ]);
  } else {
    throw new Error(
      'cannot restart Nix daemon on unknown platform ' + platform,
    );
  }
}

function spaceSepList(s: string): string[] {
  s = s.trim();
  return s ? s.split(/\s+/) : [];
}

const NIXCACHED_PORT = 38380;

(async () => {
  try {
    info('Generating configuration...');
    const useNixcached = getBooleanInput('use_nixcached');
    if (useNixcached && platform !== 'linux') {
      throw new Error('nixcached not supported on ' + platform);
    }
    const substituters = spaceSepList(
      getInput('substituters', { required: true }),
    );
    if (useNixcached && substituters.length !== 1) {
      throw new Error('Must have exactly 1 substituter for nixcached');
    }
    const {
      config: newConfig,
      tempDir,
      credsPath,
      nixcachedExe,
      nixcachedPipe,
    } = await generate({
      useNixcached,
      substituters: useNixcached
        ? [`http://localhost:${NIXCACHED_PORT}`]
        : substituters,
      trustedPublicKeys: spaceSepList(getInput('trusted_public_keys')),
      secretKeys: spaceSepList(getInput('secret_keys')),
      awsAccessKeyId: getInput('aws_access_key_id'),
      awsSecretAccessKey: getInput('aws_secret_access_key'),
    });
    if (tempDir) {
      if (!useNixcached) {
        runRootCommand(['chown', '-R', 'root:root', tempDir]);
      }
      saveState(TEMP_DIR_STATE, tempDir);
    }

    // Start nixcached, if needed.
    if (nixcachedExe) {
      const setenvFlags = [];
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const x = `GOOGLE_APPLICATION_CREDENTIALS=${process.env.GOOGLE_APPLICATION_CREDENTIALS}`;
        debug(`Using ${x} for nixcached`);
        setenvFlags.push(`--setenv=${x}`);
      }
      if (credsPath || process.env.AWS_SHARED_CREDENTIALS_FILE) {
        const x = `AWS_SHARED_CREDENTIALS_FILE=${
          credsPath || process.env.AWS_SHARED_CREDENTIALS_FILE
        }`;
        debug(`Using ${x} for nixcached`);
        setenvFlags.push(`--setenv=${x}`);
      }

      debug('Starting nixcached serve...');
      const SERVE_SERVICE = 'nixcached-serve.service';
      const servicesStarted = [SERVE_SERVICE];
      await runCommand([
        'systemd-run',
        '--user',
        `--unit=${SERVE_SERVICE}`,
        ...setenvFlags,
        nixcachedExe,
        'serve',
        `--port=${NIXCACHED_PORT}`,
        '--',
        substituters[0],
      ]);

      if (nixcachedPipe) {
        debug('Starting nixcached upload...');
        const UPLOAD_SERVICE = 'nixcached-upload.service';
        servicesStarted.push(UPLOAD_SERVICE);
        await runCommand([
          'systemd-run',
          '--user',
          `--unit=${UPLOAD_SERVICE}`,
          '--property=KillMode=mixed',
          '--property=KillSignal=SIGHUP',
          ...setenvFlags,
          nixcachedExe,
          'upload',
          '--keep-alive',
          `--input=${nixcachedPipe}`,
          '--',
          substituters[0],
        ]);
      }

      saveState(SERVICES_STATE, servicesStarted);
    }

    info('Saving configuration...');
    await runRootCommand(['mkdir', '-p', '/etc/nix']);
    await writeAsRoot('/etc/nix/nix.conf', newConfig, { append: true });
    if (credsPath && !useNixcached) {
      if (platform !== 'linux') {
        // TODO(darwin): launchctl equivalent?
        throw new Error('Private substituters not supported on ' + platform);
      }
      await runRootCommand([
        'mkdir',
        '-p',
        '/etc/systemd/system/nix-daemon.service.d',
      ]);
      const dropinPath =
        '/etc/systemd/system/nix-daemon.service.d/aws-credentials.conf';
      await writeAsRoot(
        dropinPath,
        '[Service]\n' +
          'Environment=AWS_SHARED_CREDENTIALS_FILE=' +
          credsPath +
          '\n',
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
