import {
  DASHBOARD_URL,
  ENV_NAME,
  PROJECT_SLUG,
  PR_NUMBER,
  authenticate,
  colors,
  extraHeaders,
  parseResponseBody
} from "./common";
const { requestCookie, csrfToken } = await authenticate();

/*****************************/
/*     CLOSING PR ENV      */
/*****************************/

console.log(
  `Creating new environment ${colors.blue(
    `pr-${PR_NUMBER}`
  )} in the project ${colors.blue(PROJECT_SLUG)}...`
);
const getEnvRequest = await fetch(
  `${DASHBOARD_URL}/api/projects/${PROJECT_SLUG}/environment-details/${ENV_NAME}/`,
  {
    method: "GET",
    headers: {
      "x-csrftoken": csrfToken,
      cookie: requestCookie,
      ...extraHeaders
    }
  }
);
if (![200, 404].includes(getEnvRequest.status)) {
  console.error(colors.red("❌ Failed to GET the environment for the PR ❌"));
  console.error(
    `Received status code from zaneops API : ${colors.red(getEnvRequest.status)}`
  );

  console.error("Received response from zaneops API : ");
  console.dir(await parseResponseBody(getEnvRequest), { depth: null });
  process.exit(1);
}

if (getEnvRequest.status === 200) {
  const deleteEnvRequest = await fetch(
    `${DASHBOARD_URL}/api/projects/${PROJECT_SLUG}/environment-details/${ENV_NAME}/`,
    {
      method: "DELETE",
      headers: {
        "x-csrftoken": csrfToken,
        cookie: requestCookie,
        ...extraHeaders
      }
    }
  );

  if (deleteEnvRequest.status !== 204) {
    console.error(
      colors.red("❌ Failed to archive the environment for the PR ❌")
    );
    console.error(
      `Received status code from zaneops API : ${colors.red(getEnvRequest.status)}`
    );

    console.error("Received response from zaneops API : ");
    console.dir(await parseResponseBody(getEnvRequest), { depth: null });
    process.exit(1);
  }
}

console.log(`Succesfully archived environment ${colors.blue(ENV_NAME)} ✅`);
