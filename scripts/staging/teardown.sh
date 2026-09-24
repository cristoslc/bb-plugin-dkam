#!/usr/bin/env bash
# Tear down the staging deployment for the current branch.
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Tearing down staging for branch '${BRANCH}'..."
# TODO: real teardown (uninstall plugin from staging BB instance).
echo "TODO: teardown not implemented yet"
exit 1