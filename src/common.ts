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

import { StdioNull, spawn } from 'child_process';

/** State key for the temporary directory to remove. */
export const TEMP_DIR_STATE = 'tempdir';
/** State key for the Nix systemd unit drop-in. */
export const SYSTEMD_DROPIN_STATE = 'systemd';
/** State key for a JSON array of systemd services that need to be shut down. */
export const SERVICES_STATE = 'systemd_services';
/** State key for path to the nixcached executable. */
export const NIXCACHED_EXE_STATE = 'nixcached_exe';
/** State key for path to the `nixcached upload` pipe. */
export const NIXCACHED_PIPE_STATE = 'nixcached_pipe';

export const UPLOAD_SERVICE_UNIT = 'nixcached-upload.service';

export interface CommandOptions {
  directStdoutToStderr?: boolean;
  ignoreStderr?: boolean;
  signal?: AbortSignal;
}

/**
 * Run a subprocess.
 * The returned promise will be rejected
 * if the subprocess exits with a non-zero exit code.
 */
export function runCommand(
  argv: string[],
  options?: CommandOptions,
): Promise<void> {
  return queryCommand(argv, options).then((code) => {
    if (code !== 0) {
      throw new Error(argv[0] + ' exited with ' + code);
    }
  });
}

/**
 * Run a subprocess.
 *
 * @returns The exit code of the subprocess.
 */
export function queryCommand(
  argv: string[],
  options?: CommandOptions,
): Promise<number> {
  const proc = spawn(argv[0], argv.slice(1), {
    stdio: stdioFromOptions(options),
  });
  return new Promise((resolve, reject) => {
    let listener: ((_event: Event) => void) | undefined;
    if (options?.signal) {
      listener = (_event: Event): void => {
        proc.kill('SIGTERM');
      };
      options.signal.addEventListener('abort', listener);
    }
    proc.on('close', (code) => {
      if (options?.signal && listener) {
        options.signal.removeEventListener('abort', listener);
      }
      if (code !== null) {
        resolve(code);
      } else {
        reject(new Error(argv[0] + ' exited from signal'));
      }
    });
  });
}

export function runRootCommand(
  argv: string[],
  options?: CommandOptions,
): Promise<void> {
  return runCommand(['sudo', '--non-interactive', '--', ...argv], options);
}

function stdioFromOptions(
  options: CommandOptions | undefined,
): [StdioNull, StdioNull | number, StdioNull] {
  return [
    'ignore',
    options?.directStdoutToStderr ? 2 : 'ignore',
    options?.ignoreStderr ? 'ignore' : 'inherit',
  ];
}
