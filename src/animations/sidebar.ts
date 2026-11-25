import type { Variants } from "motion/react";

import { DURATION, EASE, fadeUp } from "./variants";

export const sidebarContainer = (
	isArabic: boolean,
	isMobile: boolean,
): Variants => ({
	hidden: isMobile
		? { opacity: 0, y: 32 }
		: { opacity: 0, x: isArabic ? 32 : -32 },
	visible: {
		opacity: 1,
		x: 0,
		y: 0,
		transition: {
			duration: DURATION,
			ease: EASE,
			delayChildren: 0.12,
			staggerChildren: 0.1,
		},
	},
});

export const sidebarItem = (
	isArabic: boolean,
	isMobile: boolean,
): Variants => ({
	hidden: isMobile ? fadeUp.hidden : { opacity: 0, x: isArabic ? 24 : -24 },
	visible: {
		opacity: 1,
		x: 0,
		y: 0,
		transition: { duration: DURATION, ease: EASE },
	},
});

export const sidebarIconHover: Variants = {
	hover: {
		scale: 1.1,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};
