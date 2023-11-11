#!/usr/bin/env bash
#
# Copyright 2022 Ross Light
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail

jsfiles=( dist/index.js dist/cleanup.js )
for name in "${jsfiles[@]}"; do
  if [[ ! -e "$name" ]]; then
    echo "Bundled JavaScript out of sync; run: npm run build" 1>&2
    exit 1
  fi
done
for name in "${jsfiles[@]}"; do
  mv "$name" "${name}.bak"
done
cleanup() {
  for name in "${jsfiles[@]}"; do
    mv "${name}.bak" "$name"
  done
}
trap cleanup EXIT

if [[ ! -e node_modules ]]; then
  # Workaround for https://github.com/npm/cli/issues/3314
  npm install --silent --no-progress |& tee 1>&2
fi
npm run --silent build
for name in "${jsfiles[@]}"; do
  if ! cmp --quiet "${name}.bak" "$name"; then
    echo "Bundled JavaScript out of sync; run: npm run build" 1>&2
    exit 1
  fi
done
