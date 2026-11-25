import { Inter } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";
import AllProviders from "./providers/all-providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import BootGate from "@/components/layout/boot-gate";
import GoTopButton from "@/components/layout/go-top-button";
import Header from "@/components/layout/header";
import PageBackground from "@/components/layout/page-background";
import Sidebar from "@/components/layout/sidebar";

export { generateMetadata } from "@/lib/generate-metadata";

export const instant = false;

export const generateStaticParams = () => {
	return routing.locales.map((locale) => ({ locale }));
};

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

const RootLayout = async ({
	params,
	children,
}: {
	params: Promise<{ locale: string }>;
	children: React.ReactNode;
}) => {
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
			<head>
				{/* Apply the saved accent color before first paint so a
				    refresh never flashes the default blue first.
				    Key matches ACCENT_STORAGE_KEY in accents.constants. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var a=localStorage.getItem("accent-color");if(a&&a!=="blue"){document.documentElement.setAttribute("data-accent",a);}}catch(e){}})();`,
					}}
				/>
			</head>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<AllProviders>
						<BootGate>
							<PageBackground />

							<GoTopButton />

							<Sidebar />

							<div className="my-container">
								<Header />

								{children}
							</div>
						</BootGate>
					</AllProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
