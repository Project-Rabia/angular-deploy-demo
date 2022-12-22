#!/usr/bin/env bash

version=$(grep -o '^Release:\s\d$' "$DESCRIPTION" | grep -oE '[0-9]+')

git ls-remote --exit-code --heads origin "release/$version"

status=$?

if [ "$status" -eq 0 ]; then
  exit 0
fi

if [ "$status" -eq 1 ]; then
  {
    echo "# Generic Failure"
    echo ""
    echo "Something went wrong checking for a remote branch"
    echo "The value being looked for was \`release/$version\`"
  } > "$GITHUB_STEP_SUMMARY"
  exit 1
fi

if [ "$status" -eq 2 ]; then
  {
    echo "# Does not exist"
    echo ""
    echo "The version $version requested does not have an"
    echo "active release branch."
    echo "Please target an existing version or remove the"
    echo "request for a release merge."
  } > "$GITHUB_STEP_SUMMARY"
  exit 2
fi

