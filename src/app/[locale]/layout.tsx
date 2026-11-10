import { Inter } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";
import AllProviders from "./providers/all-providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
export { generateMetadata } from "@/lib/generate-metadata";

export const instant = false;

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// Fonts
const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	variable: "--font-inter",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
	subsets: ["arabic"],
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	variable: "--font-ibm-plex-arabic",
});

export default async function RootLayout({
	params,
	children,
}: {
	params: Promise<{ locale: string }>;
	children: React.ReactNode;
}) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as "en" | "ar")) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html
			lang={locale}
			dir={`${locale === "ar" ? "rtl" : "ltr"}`}
			className={`${ibmPlexArabic.variable} ${inter.variable} antialiased`}
			suppressHydrationWarning>
			<body className="my-container">
				<NextIntlClientProvider locale={locale} messages={messages}>
					<AllProviders>{children}</AllProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
