import {
  DASHBOARD_URL,
  ENV_NAME,
  type EnvResponse,
  PROJECT_SLUG,
  PR_NUMBER,
  SERVICE_SLUG,
  authenticate,
  colors,
  extraHeaders,
  parseResponseBody
} from "./common";
const { requestCookie, csrfToken } = await authenticate();

/*****************************/
/*     CLONING PROD ENV      */
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

let envResponse: EnvResponse;

if (getEnvRequest.status === 200) {
  envResponse = await getEnvRequest.json();
} else {
  const cloneEnvRequest = await fetch(
    `${DASHBOARD_URL}/api/projects/${PROJECT_SLUG}/clone-environment/production/`,
    {
      method: "POST",
      headers: {
        "x-csrftoken": csrfToken,
        cookie: requestCookie,
        "content-type": "application/json",
        ...extraHeaders
      },
      body: JSON.stringify({
        name: `pr-${PR_NUMBER}`,
        deploy_services: true
      })
    }
  );

  if (![201, 409].includes(cloneEnvRequest.status)) {
    console.error(
      colors.red("❌ Failed to clone the production environment ❌")
    );
    console.error(
      `Received status code from zaneops API : ${colors.red(cloneEnvRequest.status)}`
    );

    console.error("Received response from zaneops API : ");
    console.dir(await parseResponseBody(cloneEnvRequest), { depth: null });
    process.exit(1);
  } else {
    console.log(`Successfully created environment ${colors.blue(ENV_NAME)} ✅`);
    envResponse = await cloneEnvRequest.json();
  }
}

console.log(`Environment available in ${colors.blue(ENV_NAME)}`);

const docsService = envResponse.services.find(
  (srv) => srv.slug === SERVICE_SLUG
);
if (!docsService) {
  console.error(
    `The cloned environment doesn't have the service "${SERVICE_SLUG}"`
  );
  process.exit(1);
}

const domain = docsService.urls[0].domain;
const file = Bun.file("./service-url");
const writer = file.writer();
writer.write(docsService.urls[0].domain);
writer.flush();
writer.end();
console.log(`Service deployed to ${colors.green(domain)} !`);
