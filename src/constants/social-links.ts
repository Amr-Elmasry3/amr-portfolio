import { SITE_CONFIG } from "@/constants/site-config.constants";

// Social/contact links shown in the hero (and reused by later
// sections). The mailto is built from the site config email —
// the previous version of the site had a stray "www." in it.
interface SocialLink {
	title: string;
	icon: string;
	href: string;
}

export const socialLinks: SocialLink[] = [
	{ title: "github", icon: "github", href: SITE_CONFIG.github },
	{ title: "linkedin", icon: "linkedin", href: SITE_CONFIG.linkedin },
	{ title: "gmail", icon: "envelopeFill", href: `mailto:${SITE_CONFIG.email}` },
];
