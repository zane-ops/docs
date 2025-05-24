import * as cookie from "cookie-es";
import { z } from "zod";

const envVariables = z.object({
  ZANE_USERNAME: z.string(),
  ZANE_PASSWORD: z.string(),
  CF_CLIENT_ID: z.string(),
  CF_CLIENT_SECRET: z.string(),
  PR_NUMBER: z.coerce.number()
});
export const PROJECT_SLUG = "zane-docs";
export const DASHBOARD_URL = "https://lab.fkiss.me";
export const SERVICE_SLUG = "zn-docs";
export type EnvResponse = {
  name: string;
  services: Array<{
    slug: string;
    urls: Array<{ domain: string }>;
  }>;
};

const Colors = {
  GREEN: "\x1b[92m",
  BLUE: "\x1b[94m",
  ORANGE: "\x1b[38;5;208m",
  RED: "\x1b[91m",
  GREY: "\x1b[90m",
  ENDC: "\x1b[0m"
} as const;

export const colors = {
  green: (input: any) => `${Colors.GREEN}${input}${Colors.ENDC}`,
  blue: (input: any) => `${Colors.BLUE}${input}${Colors.ENDC}`,
  orange: (input: any) => `${Colors.ORANGE}${input}${Colors.ENDC}`,
  red: (input: any) => `${Colors.RED}${input}${Colors.ENDC}`,
  grey: (input: any) => `${Colors.GREY}${input}${Colors.ENDC}`
} as const;

export async function parseResponseBody(response: Response) {
  return response.headers.get("content-type") === "application/json"
    ? await response.json()
    : await response.text();
}

export const {
  ZANE_USERNAME: username,
  ZANE_PASSWORD: password,
  CF_CLIENT_ID,
  CF_CLIENT_SECRET,
  PR_NUMBER
} = envVariables.parse(process.env);
export const ENV_NAME = `pr-${PR_NUMBER}`;

export const extraHeaders = {
  "CF-Access-Client-Id": CF_CLIENT_ID,
  "CF-Access-Client-Secret": CF_CLIENT_SECRET
};

export async function authenticate() {
  /*****************************/
  /*      CSRF TOKEN           */
  /*****************************/
  console.log(
    `Getting the CSRF token on ZaneOps API at ${colors.blue(DASHBOARD_URL)}...`
  );
  const csrfResponse = await fetch(`${DASHBOARD_URL}/api/csrf`, {
    headers: extraHeaders
  });
  if (csrfResponse.status !== 200) {
    console.error(
      colors.red("❌ Failed to get CSRF token from ZaneOps API ❌")
    );
    console.error(
      `Received status code from zaneops API : ${colors.red(csrfResponse.status)}`
    );

    console.error("Received response from zaneops API : ");
    console.dir(await parseResponseBody(csrfResponse), { depth: null });
    process.exit(1);
  } else {
    console.log(`Got the CSRF token successfully ✅`);
  }
  const csrfTokenStr = cookie
    .splitSetCookieString(csrfResponse.headers.get("set-cookie") ?? "")
    .filter((cookieStr) => cookieStr.startsWith("csrftoken"))[0];
  const csrfToken = cookie.parseSetCookie(csrfTokenStr).value;

  /*****************************/
  /*     AUTHENTICATION        */
  /*****************************/
  console.log(`Authenticating to ZaneOps API...`);
  const authResponse = await fetch(`${DASHBOARD_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "x-csrftoken": csrfToken,
      cookie: `csrftoken=${csrfToken}`,
      "content-type": "application/json",
      ...extraHeaders
    },
    body: JSON.stringify({ username, password })
  });
  if (authResponse.status !== 201) {
    console.error(colors.red("❌ Failed to authenticate to ZaneOps API ❌"));
    console.error(
      `Received status code from zaneops API : ${colors.red(authResponse.status)}`
    );

    console.error("Received response from zaneops API : ");
    console.dir(await parseResponseBody(authResponse), { depth: null });
    process.exit(1);
  } else {
    console.log(`Successfully Authenticated to ZaneOps API ✅`);
  }

  const sessionIdCookieStr = cookie
    .splitSetCookieString(authResponse.headers.get("set-cookie") ?? "")
    .filter((cookieStr) => cookieStr.startsWith("sessionid"))[0];

  const sessionId = cookie.parseSetCookie(sessionIdCookieStr).value;
  const requestCookie = [
    cookie.serialize("sessionid", sessionId),
    cookie.serialize("csrftoken", csrfToken),
    ""
  ].join(";");
  return { requestCookie, csrfToken };
}
