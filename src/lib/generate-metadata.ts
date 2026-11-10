import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SITE_CONFIG } from "@/constants/site-config.constants";

interface MetadataParams {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: MetadataParams): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });
	const description = t.has("description")
		? t("description")
		: SITE_CONFIG.description;
	const localeUrl = `${SITE_CONFIG.url}/${locale}`;

	return {
		metadataBase: new URL(SITE_CONFIG.url),
		title: {
			default: SITE_CONFIG.title,
			template: `%s | ${SITE_CONFIG.name}`,
		},
		description,
		keywords: [...SITE_CONFIG.keywords],
		authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
		creator: SITE_CONFIG.name,
		alternates: {
			canonical: localeUrl,
			languages: {
				en: `${SITE_CONFIG.url}/en`,
				ar: `${SITE_CONFIG.url}/ar`,
			},
		},
		openGraph: {
			type: "website",
			locale: locale === "ar" ? "ar_EG" : "en_US",
			url: localeUrl,
			title: SITE_CONFIG.title,
			description,
			siteName: SITE_CONFIG.name,
			images: [
				{
					url: SITE_CONFIG.ogImage,
					width: 1200,
					height: 630,
					alt: SITE_CONFIG.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: SITE_CONFIG.title,
			description,
			images: [SITE_CONFIG.ogImage],
		},
		icons: {
			icon: "/favicon.ico",
			apple: "/apple-touch-icon.png",
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}
