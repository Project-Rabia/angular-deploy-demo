module.exports = async ({ github, context }) => {
  const requestCreator = context.payload.sender.login;
  const isNotRequestor = (item) => {
    return item.toLowerCase() !== requestCreator.toLowerCase();
  };
  const reviewers = [
    'garbee',
    // Other team members
  ].filter(isNotRequestor);
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const pull_number = context.payload.number;
  await github.rest.issues.addAssignees({
    owner,
    repo,
    issue_number: pull_number,
    assignees: [requestCreator],
  });
  await github.rest.pulls.requestReviewers({
    owner,
    repo,
    pull_number,
    reviewers,
  });
};
