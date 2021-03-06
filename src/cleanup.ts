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

import { getState, info, setFailed } from '@actions/core';

import { runRootCommand, TEMP_DIR_STATE, SYSTEMD_DROPIN_STATE } from './common';

(async () => {
  try {
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
