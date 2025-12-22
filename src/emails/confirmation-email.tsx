import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text
} from "@react-email/components";
import { tailwindConfig } from "./config";

type ConfirmationEmailProps = {
  name: string;
  baseUrl?: string;
};

export function ConfirmationEmail({
  name,
  baseUrl = "https://zaneops.dev"
}: ConfirmationEmailProps) {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans">
          <Preview>You're on the ZaneOps Cloud Waitlist!</Preview>
          <Container className="px-3 mx-auto">
            <Heading className="text-[#333] text-[24px] my-10 mx-0 p-0">
              Welcome to the Cloud waitlist!
            </Heading>
            <Text className="text-[#333] text-[16px] my-6">Hi {name},</Text>
            <Text className="text-[#333] text-[14px] my-6">
              Your email has been verified successfully! You're now officially
              on the ZaneOps Cloud waitlist.
            </Text>
            <Text className="text-[#333] text-[14px] my-6">
              We'll keep you updated on our progress and let you know as soon as
              we're ready to launch. In the meantime, you can also use ZaneOps
              self-hosted or explore our documentation to learn more about what
              ZaneOps can do.
            </Text>
            <Link
              href="https://zaneops.dev/introduction"
              target="_blank"
              className="text-brand text-[14px] underline mb-4 block"
            >
              Explore Documentation
            </Link>
            <Text className="text-[#333] text-[14px] my-6">
              Have questions? Check out our{" "}
              <Link
                href="https://zaneops.dev/introduction"
                className="text-brand underline"
              >
                documentation
              </Link>{" "}
              or join our{" "}
              <Link
                href="https://zaneops.dev/discord"
                className="text-brand underline"
              >
                Discord community
              </Link>
              .
            </Text>
            <Text className="text-[#ababab] text-[14px] mt-3.5 mb-4">
              Thank you for your interest in ZaneOps!
            </Text>

            <Img
              src={`${baseUrl}/logo.png`}
              width="42"
              height="42"
              alt="ZaneOps's Logo"
            />

            <Text className="text-[#898989] text-[12px] leading-[22px] mt-3 mb-6">
              <Link
                href="https://zaneops.dev"
                target="_blank"
                className="text-[#898989] text-[14px] underline"
              >
                ZaneOps.dev
              </Link>
              , the best open-source platform
              <br />
              for deploying and managing your applications.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ConfirmationEmail.PreviewProps = {
  name: "Fred",
  baseUrl: "http://localhost:3000"
} satisfies ConfirmationEmailProps;

export default ConfirmationEmail;
