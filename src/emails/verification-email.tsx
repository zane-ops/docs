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

type VerificationEmailProps = {
  name: string;
  verificationUrl: string;
};

export function VerificationEmail({
  name,
  verificationUrl
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans">
          <Preview>Verify your email for ZaneOps Waitlist</Preview>
          <Container className="px-3 mx-auto">
            <Heading className="text-[#333] text-[24px] my-10 mx-0 p-0">
              Verify your email address
            </Heading>
            <Text className="text-[#333] text-[16px] my-6">Hi {name},</Text>
            <Text className="text-[#333] text-[14px] my-6">
              Thank you for joining the ZaneOps waitlist! To complete your
              registration, please verify your email address by clicking the
              link below.
            </Text>
            <Link
              href={verificationUrl}
              className="text-brand text-[14px] underline mb-4 block"
            >
              Click here to verify your email
            </Link>
            <Text className="text-[#333] text-[14px] my-6 mb-3.5">
              Or, copy and paste this verification link:
            </Text>
            <code className="inline-block py-4 px-[4.5%] w-9/10 bg-[#f4f4f4] rounded-md border border-solid border-[#eee] text-[#333] break-all">
              {verificationUrl}
            </code>
            <Text className="text-[#ababab] text-[14px] mt-3.5 mb-4">
              This link will expire in 24 hours. If you didn&apos;t sign up for
              ZaneOps, you can safely ignore this email.
            </Text>

            <Img
              src={`https://zaneops.dev/favicon.svg`}
              width="42"
              height="42"
              alt="Notion's Logo"
            />
            <Text className="text-[#898989] text-[12px] leading-[22px] mt-3 mb-6">
              <Link
                href="https://zaneops.dev"
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

VerificationEmail.PreviewProps = {
  name: "Fred",
  verificationUrl:
    "https://zaneops.dev/verify-email?token=7F3E9A2B8D1C4F6E5A9B2C8D1E4F7A3B6C9D2E5F8A1B4C7D0E3F6A9B2C5D8E1F4"
} satisfies VerificationEmailProps;

export default VerificationEmail;
