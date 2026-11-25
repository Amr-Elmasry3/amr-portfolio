import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
export const DURATION = 0.6;

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: DURATION, ease: EASE },
	},
};

export const fadeScale: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: DURATION, ease: EASE },
	},
};

export const staggerContainer = (
	staggerDelay: number,
	initialDelay = 0,
): Variants => ({
	hidden: {},
	visible: {
		transition: {
			delayChildren: initialDelay,
			staggerChildren: staggerDelay,
		},
	},
});

export const drawLine: Variants = {
	hidden: { pathLength: 0 },
	visible: {
		pathLength: 1,
		transition: { duration: DURATION, ease: EASE },
	},
};
