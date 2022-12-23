#!/usr/bin/env bash

releaseString=$(echo "$BODY" | grep -oE '^Release:+[[:space:]]+[0-9]+$')
version=$(echo "$releaseString" | cut -d ":" -f 2 | xargs)

# The script may be executed if the string `Release:` is used
# within a body message. The grep checks only if it looks like
# it should be in place of a trailer. So if the version is
# not found, exit without error.
if [ -z "$version" ]; then
  exit 0
fi

git ls-remote --exit-code --heads origin "release/$version"

status=$?

if [ "$status" -eq 0 ]; then
  exit 0
fi

if [ "$status" -eq 1 ]; then
  {
    echo "# Generic Failure"
    echo ""
    echo ""
    echo "<details>"
    echo "<summary>PR Body</summary>"
    echo ""
    echo "\`\`\`"
    echo "$BODY"
    echo "\`\`\`"
    echo ""
    echo "</details>"
    echo ""
    echo "Requested version: $version"
    echo ""
    echo "Something went wrong checking for a remote branch"
  } > "$GITHUB_STEP_SUMMARY"
  exit 1
fi

if [ "$status" -eq 2 ]; then
  {
    echo "# Does not exist"
    echo ""
    echo ""
    echo "<details>"
    echo "<summary>PR Body</summary>"
    echo ""
    echo "\`\`\`"
    echo "$BODY"
    echo "\`\`\`"
    echo ""
    echo "</details>"
    echo ""
    echo "Requested version: $version"
    echo ""
    echo "The version requested does not have an active release branch."
    echo "Please target an existing version or remove the request for a release merge."
  } > "$GITHUB_STEP_SUMMARY"
  exit 2
fi

