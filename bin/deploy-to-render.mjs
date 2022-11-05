const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
const SERVICEID = process.env.RENDER_SERVICE_ID;
const APIKEY = process.env.RENDER_API_KEY;

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

function callRender(targetUrl, method = 'GET') {
  return fetch(targetUrl, {
    method,
    headers: { 'Authorization': `Bearer ${APIKEY}` }
  });
}

if (!SERVICEID || !APIKEY) {
  console.error('API Key or Service ID not provided.');
  process.exit(1);
}

const deployUrl = `https://api.render.com/v1/services/${SERVICEID}/deploys`;

const pendingStatuses = [
  'created',
  'build_in_progress',
  'update_in_progress',
];

const errorStatuses = [
  'deactivated',
  'build_failed',
  'update_failed',
  'canceled'
];

const successStatus = 'live';

let currentStatus = 'created';

if (DEBUG_MODE) {
  console.log('Requesting deployment');
  console.log(deployUrl);
}

const requestResponse = await callRender(deployUrl, 'POST');

const requestData = await requestResponse.json();
if (DEBUG_MODE) {
  console.log(requestData);
}
const deployId = requestData.id;
const statusUrl = `https://api.render.com/v1/services/${SERVICEID}/deploys/${deployId}`;

if (DEBUG_MODE) {
  console.log('Status URL');
  console.log(statusUrl);
}

while (pendingStatuses.includes(currentStatus) === true) {
  await sleep(10);

  const response = await callRender(statusUrl);
  const data = await response.json();

  if (DEBUG_MODE) {
    console.log(data);
  }

  currentStatus = data.status;
}

if (currentStatus === successStatus) {
  console.log('Deployment is live');
  process.exit(0);
}

if (errorStatuses.includes(currentStatus)) {
  console.error('Deployment failed. Status is:', currentStatus);
  process.exit(1);
}

console.error(
  'Something went wrong. The current status is: ',
  currentStatus,
);
process.exit(2);
