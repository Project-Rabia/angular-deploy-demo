#!/usr/bin/env bash

# main can always go to Development
if [[ "$BRANCH_NAME" == "main" ]]; then
  echo "toDevelopment=true" >> "$GITHUB_OUTPUT"
fi

# "no" as a release window value means one is not open

# If a release window is open
if [[ "$RELEASE_WINDOW" != 'no' ]]; then
  # The branch must start with `release/` and end with the given window
  if [[ "$BRANCH_NAME" == "release/"* && "$BRANCH_NAME" == *"$RELEASE_WINDOW" ]]; then
    # To deploy to staging and eventually production
    echo "toStaging=true" >> "$GITHUB_OUTPUT"
    echo "toProduction=true" >> "$GITHUB_OUTPUT"
  fi
else
  # If the release window is set to "no" we deploy if the branch
  # is `main` straight to Staging
  if [[ "$BRANCH_NAME" == "main" ]]; then
    echo "toStaging=true" >> "$GITHUB_OUTPUT"
  fi
fi
