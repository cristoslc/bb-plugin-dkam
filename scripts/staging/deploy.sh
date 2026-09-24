#!/usr/bin/env bash
# Deploy DKAM to the staging target for the current branch.
# The branch name is the staging identity.
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Deploying branch '${BRANCH}' to staging..."

# TODO: real staging deployment. For a BB plugin, staging is an install into
# a staging BB instance, e.g.:
#   bb plugin install <path-or-git-url>
echo "TODO: staging deploy not implemented yet"
exit 1