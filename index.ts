const Colors = {
  GREEN: "\x1b[92m",
  BLUE: "\x1b[94m",
  ORANGE: "\x1b[38;5;208m",
  RED: "\x1b[91m",
  GREY: "\x1b[90m",
  ENDC: "\x1b[0m"
} as const;

const colors = {
  green: (input: any) => `${Colors.GREEN}${input}${Colors.ENDC}`,
  blue: (input: any) => `${Colors.BLUE}${input}${Colors.ENDC}`,
  orange: (input: any) => `${Colors.ORANGE}${input}${Colors.ENDC}`,
  red: (input: any) => `${Colors.RED}${input}${Colors.ENDC}`,
  grey: (input: any) => `${Colors.GREY}${input}${Colors.ENDC}`
} as const;

const serviceImage = process.env.SERVICE_IMAGE!;
const commitMessage = process.env.COMMIT_MESSAGE!;
const webhookUrl = process.env.DEPLOY_WEBHOOK_URL!;

console.log(`Deploying the service...`);
const deploymentResponse = await fetch(webhookUrl, {
  method: "PUT",
  headers: {
    "content-type": "application/json",
    "CF-Access-Client-Id": process.env.CF_CLIENT_ID!,
    "CF-Access-Client-Secret": process.env.CF_CLIENT_SECRET!
  },
  body: JSON.stringify({
    commit_message: commitMessage,
    new_image: serviceImage
  })
});

if (deploymentResponse.status === 200) {
  console.log(`Deployment queued succesfully ✅`);
  console.log(`inspect in your dashboard`);
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
  throw new Error();
}

export {};
