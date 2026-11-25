import type { Variants } from "motion/react";

import {
	DURATION,
	EASE,
	fadeScale,
	fadeUp,
	staggerContainer,
} from "./variants";

export const heroHeaderContainer = staggerContainer(0.1);
export const heroLogo = fadeUp;
export const heroSettings = staggerContainer(0.1);
export const heroLanguageSwitcher = fadeUp;
export const heroThemeToggle = fadeUp;

export const heroDetailsContainer = staggerContainer(0.1, 0.2);
export const heroHello = fadeUp;
export const heroName = fadeUp;
export const heroTitle = fadeUp;
export const heroDescription = fadeUp;

export const heroStatusContainer = staggerContainer(0.1);
export const heroStatusBadge = fadeUp;

export const heroButtonsContainer = staggerContainer(0.1);
export const heroButton = fadeUp;

export const heroSocialContainer = staggerContainer(0.08);
export const heroSocialLabel = fadeUp;
export const heroSocialIcon = fadeUp;

export const heroImage: Variants = {
	...fadeScale,
	visible: {
		...fadeScale.visible,
		transition: { duration: DURATION, delay: 0.2, ease: EASE },
	},
};
