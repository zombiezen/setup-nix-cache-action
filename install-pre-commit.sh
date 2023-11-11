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

GIT_DIR="$(git rev-parse --absolute-git-dir)"
cat > "$GIT_DIR/hooks/pre-commit" <<EOF
#!${SHELL}
if command -v direnv > /dev/null; then
  exec direnv exec . bash pre-commit.sh
else
  exec ./pre-commit.sh
fi
EOF
chmod +x "$GIT_DIR/hooks/pre-commit"
