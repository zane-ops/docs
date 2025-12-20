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

interface ConfirmationEmailProps {
	name: string;
}

export function ConfirmationEmail({ name }: ConfirmationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>You're on the ZaneOps Waitlist!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>ZaneOps</Heading>
					<Heading style={h2}>Welcome to the waitlist!</Heading>
					<Text style={text}>Hi {name},</Text>
					<Text style={text}>
						Your email has been verified successfully! You're now officially on
						the ZaneOps waitlist.
					</Text>
					<Text style={text}>
						We'll keep you updated on our progress and let you know as soon as
						we're ready to launch. In the meantime, feel free to explore our
						documentation to learn more about what ZaneOps can do.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href="https://zaneops.dev/introduction">
							Explore Documentation
						</Button>
					</Section>
					<Text style={text}>
						Have questions? Check out our{" "}
						<Link href="https://zaneops.dev/introduction" style={link}>
							documentation
						</Link>{" "}
						or join our{" "}
						<Link href="https://zaneops.dev/discord" style={link}>
							Discord community
						</Link>
						.
					</Text>
					<Text style={footer}>
						Thank you for your interest in ZaneOps!
						<br />— The ZaneOps Team
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

export default ConfirmationEmail;

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
