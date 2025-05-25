import {
  DASHBOARD_URL,
  ENV_NAME,
  type EnvResponse,
  PROJECT_SLUG,
  SERVICE_SLUG,
  authenticate,
  colors,
  env,
  extraHeaders,
  parseResponseBody
} from "./common";
const { requestCookie, csrfToken } = await authenticate();

/*****************************/
/*     CLONING PROD ENV      */
/*****************************/
console.log(
  `Creating new environment ${colors.blue(
    `pr-${env.PR_NUMBER}`
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
        name: `pr-${env.PR_NUMBER}`,
        deploy_services: false
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

    envResponse = await getEnvRequest.json();
  }
}

console.log(`Environment in ${colors.blue(ENV_NAME)}`);

const docsService = envResponse.services.find(
  (srv) => srv.slug === SERVICE_SLUG
);
if (!docsService) {
  console.error(
    `The cloned environment doesn't have the service "${SERVICE_SLUG}"`
  );
  process.exit(1);
}

const change = {
  field: "git_source",
  type: "UPDATE",
  new_value: {
    repository_url: "https://github.com/zane-ops/docs.git",
    branch_name: env.PR_BRANCH_NAME,
    commit_sha: "HEAD"
  }
};

console.log(
  `Updating the branch name for the service ${colors.orange(
    SERVICE_SLUG
  )} in the project ${colors.orange(PROJECT_SLUG)}...`
);
const requestChangeResponse = await fetch(
  `${DASHBOARD_URL}/api/projects/${PROJECT_SLUG}/${ENV_NAME}/request-service-changes/${SERVICE_SLUG}/`,
  {
    method: "PUT",
    headers: {
      "x-csrftoken": csrfToken,
      cookie: requestCookie,
      "content-type": "application/json",
      ...extraHeaders
    },
    body: JSON.stringify(change)
  }
);

if (requestChangeResponse.status !== 200) {
  console.log(
    colors.red("❌ Failed to update the image of the service on ZaneOps API ❌")
  );
  console.log(
    `Received status code from zaneops API : ${colors.red(
      requestChangeResponse.status
    )}`
  );

  console.log("Received response from zaneops API : ");
  console.dir(await parseResponseBody(requestChangeResponse), {
    depth: null
  });
  // core.setFailed("Failure");
  process.exit(1);
} else {
  console.log(
    `Successfully Updated the repository branch to ${colors.orange(change.new_value.branch_name)} ✅`
  );
}

console.log(
  `Queuing a new deployment for the service ${colors.orange(SERVICE_SLUG)}...`
);
const deploymentResponse = await fetch(
  `${DASHBOARD_URL}/api/projects/${PROJECT_SLUG}/${ENV_NAME}/deploy-service/git/${SERVICE_SLUG}/`,
  {
    method: "PUT",
    headers: {
      "x-csrftoken": csrfToken,
      cookie: requestCookie,
      "content-type": "application/json",
      ...extraHeaders
    }
  }
);

if (deploymentResponse.status >= 200 && deploymentResponse.status <= 299) {
  const deployment = await deploymentResponse.json();
  console.log(`Deployment queued succesfully ✅`);
  console.log(
    `inspect here ➡️ ${colors.blue(
      `${DASHBOARD_URL}/project/${PROJECT_SLUG}/${ENV_NAME}/services/${SERVICE_SLUG}/deployments/${deployment.hash}/build-logs`
    )}`
  );
} else {
  console.log(colors.red("❌ Failed to queue deployment ❌"));
  console.log(
    `Received status code from zaneops API : ${colors.red(
      deploymentResponse.status
    )}`
  );

  const response =
    deploymentResponse.headers.get("content-type") === "application/json"
      ? await deploymentResponse.json()
      : await deploymentResponse.text();
  console.log("Received response from zaneops API : ");
  console.dir(response);
  process.exit(1);
}

const domain = docsService.urls[0].domain;
const file = Bun.file("./service-url");
const writer = file.writer();
writer.write(docsService.urls[0].domain);
writer.flush();
writer.end();
console.log(`Service deployed to ${colors.green(domain)} !`);
