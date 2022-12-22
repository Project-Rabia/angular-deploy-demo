module.exports = async ({ github, context }) => {
  await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.number,
    reviewers: ['garbee']
  });
};
