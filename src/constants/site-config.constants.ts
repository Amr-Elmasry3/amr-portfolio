export const SITE_CONFIG = {
	name: "Amr Elmasry",
	title: "Amr Elmasry | Frontend Developer",
	description:
		"Frontend Developer building fast, modern, and delightful web experiences with React, Next.js, and TypeScript.",
	// Update this env value in Vercel Project Settings when a final custom domain is available, then redeploy.
	url:
		process.env.NEXT_PUBLIC_SITE_URL ||
		"https://amr-elmasry-portfolio.vercel.app",
	ogImage: "/og-image.png",
	email: "amrelmasry66@gmail.com",
	github: "https://github.com/Amr-Elmasry3",
	linkedin: "https://www.linkedin.com/in/amr-elmasry66",
	keywords: [
		"Frontend Developer",
		"React Developer",
		"Next.js Developer",
		"TypeScript Developer",
		"Web Developer Egypt",
		"Frontend Developer Egypt",
		"React.js",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"Responsive Web Development",
		"UI Development",
	],
} as const;
