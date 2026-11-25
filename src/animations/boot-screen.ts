import type { Variants } from "motion/react";

export const letterVariants: Variants = {
	hidden: (i: number) => ({
		opacity: 0,
		y: -20,
		x: (i - 5) * 12,
		rotate: i % 2 === 0 ? -15 : 15,
	}),
	visible: {
		opacity: 1,
		y: 0,
		x: 0,
		rotate: 0,
		transition: { type: "spring", stiffness: 200, damping: 14 } as const,
	},
};
