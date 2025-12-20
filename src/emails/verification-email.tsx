import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface VerificationEmailProps {
	name: string;
	verificationUrl: string;
}

export function VerificationEmail({
	name,
	verificationUrl,
}: VerificationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify your email for ZaneOps Waitlist</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>ZaneOps</Heading>
					<Heading style={h2}>Verify your email address</Heading>
					<Text style={text}>Hi {name},</Text>
					<Text style={text}>
						Thank you for joining the ZaneOps waitlist! To complete your
						registration, please verify your email address by clicking the button
						below.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href={verificationUrl}>
							Verify Email
						</Button>
					</Section>
					<Text style={text}>
						Or copy and paste this URL into your browser:
					</Text>
					<Link href={verificationUrl} style={link}>
						{verificationUrl}
					</Link>
					<Text style={footer}>
						This link will expire in 24 hours. If you didn't sign up for
						ZaneOps, you can safely ignore this email.
					</Text>
					<Text style={footer}>
						— The ZaneOps Team
						<br />
						<Link href="https://zaneops.dev" style={link}>
							zaneops.dev
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

export default VerificationEmail;

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
	maxWidth: "600px",
};

const h1 = {
	color: "#333",
	fontSize: "24px",
	fontWeight: "bold",
	margin: "40px 0",
	padding: "0 40px",
};

const h2 = {
	color: "#333",
	fontSize: "20px",
	fontWeight: "600",
	margin: "0 0 15px",
	padding: "0 40px",
};

const text = {
	color: "#333",
	fontSize: "16px",
	lineHeight: "26px",
	padding: "0 40px",
};

const buttonContainer = {
	padding: "27px 40px",
};

const button = {
	backgroundColor: "#5469d4",
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px 20px",
};

const link = {
	color: "#5469d4",
	textDecoration: "underline",
};

const footer = {
	color: "#8898aa",
	fontSize: "14px",
	lineHeight: "24px",
	padding: "0 40px",
	marginTop: "20px",
};
