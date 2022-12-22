module.exports = async ({ github, context }) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const pull_number = context.payload.number;
  await github.rest.pulls.addAssignees({
    owner,
    repo,
    pull_number,
    assignees: [context.payload.sender.login],
  });
  // await github.rest.pulls.requestReviewers({
  //   owner,
  //   repo,
  //   pull_number,
  //   reviewers: ['garbee']
  // });
};
