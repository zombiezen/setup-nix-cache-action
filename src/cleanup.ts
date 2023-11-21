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

import { error, getState, info, setFailed } from '@actions/core';

import {
  runRootCommand,
  TEMP_DIR_STATE,
  SYSTEMD_DROPIN_STATE,
  SERVICES_STATE,
  runCommand,
  UPLOAD_SERVICE_UNIT,
  queryCommand,
  NIXCACHED_EXE_STATE,
  NIXCACHED_PIPE_STATE,
} from './common';

async function shutDownUploadService(
  nixcachedExe: string,
  nixcachedPipe: string,
) {
  const journalctlAbort = new AbortController();
  const journalctlPromise = runCommand(
    ['journalctl', `--user-unit=${UPLOAD_SERVICE_UNIT}`, '--follow'],
    {
      signal: journalctlAbort.signal,
      directStdoutToStderr: true,
    },
  );

  await runCommand(
    [nixcachedExe, 'send', '--finish', `--output=${nixcachedPipe}`],
    {
      directStdoutToStderr: true,
    },
  );

  // Wait until service has exited.
  for (;;) {
    // Always wait a little bit because we want to give journalctl space to show output.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await queryCommand(
      ['systemctl', 'is-active', '--user', '--quiet', UPLOAD_SERVICE_UNIT],
      { directStdoutToStderr: true },
    );
    if (result !== 0) {
      break;
    }
  }

  // Stop journalctl subprocess.
  journalctlAbort.abort();
  try {
    await journalctlPromise;
  } catch (_) {
    // Since we signal journalctl to stop, it will never succeed.
  }
}

(async () => {
  try {
    const servicesStateData = getState(SERVICES_STATE);
    if (servicesStateData) {
      let servicesStarted = JSON.parse(servicesStateData);
      if (
        servicesStarted instanceof Array &&
        servicesStarted.every((x) => typeof x === 'string')
      ) {
        if (servicesStarted.indexOf(UPLOAD_SERVICE_UNIT) >= 0) {
          const nixcachedExe = getState(NIXCACHED_EXE_STATE);
          const nixcachedPipe = getState(NIXCACHED_PIPE_STATE);
          if (!nixcachedExe || !nixcachedPipe) {
            error(
              `Running ${UPLOAD_SERVICE_UNIT}, but ${NIXCACHED_EXE_STATE} and/or ${NIXCACHED_PIPE_STATE} not set in state!`,
            );
          } else {
            await shutDownUploadService(nixcachedExe, nixcachedPipe);
            servicesStarted = servicesStarted.filter(
              (x) => x != UPLOAD_SERVICE_UNIT,
            );
          }
        }

        info(`Stopping systemd services ${servicesStarted.join()}...`);
        await runCommand(['systemctl', 'stop', '--user', ...servicesStarted]);
      }
    }

    const tempDir = getState(TEMP_DIR_STATE);
    if (tempDir) {
      info('Removing ' + tempDir + '...');
      await runRootCommand(['rm', '-rf', tempDir]);
    }
    const systemdDropinState = getState(SYSTEMD_DROPIN_STATE);
    if (systemdDropinState) {
      info('Removing ' + systemdDropinState + '...');
      await runRootCommand(['rm', '-f', systemdDropinState]);
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed(error + '');
    }
  }
})();
