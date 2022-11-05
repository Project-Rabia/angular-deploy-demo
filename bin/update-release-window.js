module.exports = async ({ github, context, sodium }) => {
  const secretKey = 'RELEASE_WINDOW';
  const { owner, repo } = context.repo;
  const { eventName } = context;
  const secret = eventName === 'delete' ? 'no' : context.payload.ref.replace('release/', '');
  const keyResponse = await github.rest.actions.getRepoPublicKey({
    owner,
    repo,
  });
  const { key, key_id } = keyResponse.data;

  await sodium.ready;

  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(
    key,
    sodium.base64_variants.ORIGINAL,
  );
  const binsec = sodium.from_string(secret);

  //Encrypt the secret using LibSodium
  const encBytes = sodium.crypto_box_seal(
    binsec,
    binkey,
  );

  // Convert encrypted Uint8Array to Base64
  const output = sodium.to_base64(
    encBytes,
    sodium.base64_variants.ORIGINAL,
  );


  await github.rest.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name: secretKey,
    encrypted_value: output,
    key_id,
  });

  if (secret === 'no') {
    console.log('Release window has been closed.');
  } else {
    console.log(`Release window has been opened for release ${secret}`);
  }

};

