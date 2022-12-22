module.exports = async ({ github, context }) => {
  await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.name,
    pull_number: context.payload.number,
    reviewers: ['garbee']
  });
};
