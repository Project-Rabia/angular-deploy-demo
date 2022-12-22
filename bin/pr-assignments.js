module.exports = async ({ github, context }) => {
  // await github.rest.pulls.requestReviewers({
  //   owner: context.owner,
  //   repo: context.repository.name,
  //   pull_number: context.payload.number,
  //   reviewers: []
  // });
  console.log('github', github);
  console.log('context', context.repo.owner);
};
