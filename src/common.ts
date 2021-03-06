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

import { spawn } from 'child_process';

export const TEMP_DIR_STATE = 'tempdir';
export const SYSTEMD_DROPIN_STATE = 'systemd';

export interface RootCommandOptions {
  ignoreStderr?: boolean;
}

export function runRootCommand(argv: string[], options?: RootCommandOptions): Promise<void> {
  const proc = spawn('sudo', argv, {
    stdio: ['ignore', 'ignore', options?.ignoreStderr ? 'ignore' : 'inherit'],
  });
  return new Promise<void>((resolve, reject) => {
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(argv[0] + ' exited with ' + code));
      }
    });
  });
}
