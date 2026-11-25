"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import { letterVariants } from "@/animations/boot-screen";

const enLetters = ["A", "M", "R", " ", "E", "L", "M", "A", "S", "R", "Y"];
const arLetters = ["Y", "R", "S", "A", "M", "L", "E", " ", "R", "M", "A"];

interface BootScreenProps {
	onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
	const [isDone, setIsDone] = useState(false);
	const currentLocale = useLocale();

	useEffect(() => {
		const exitTimer = setTimeout(() => setIsDone(true), 1400);
		const completeTimer = setTimeout(onComplete, 1600);

		return () => {
			clearTimeout(exitTimer);
			clearTimeout(completeTimer);
		};
	}, [onComplete]);

	const letters = currentLocale === "en" ? enLetters : arLetters;

	return (
		<AnimatePresence>
			{!isDone && (
				<motion.div
					key="boot"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0, scale: 1.05 }}
					transition={{ duration: 0.4 }}
					className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-surface-secondary via-primary-lighter to-surface-secondary">
					<div className="flex items-center gap-1">
						{letters.map((letter, i) => (
							<motion.span
								key={`${letter}-${i}`}
								custom={i}
								initial="hidden"
								animate="visible"
								variants={letterVariants}
								transition={{ delay: i * 0.08 }}
								className="text-heading2 sm:text-heading1 font-bold gradient-text">
								{letter === " " ? "\u00A0" : letter}
							</motion.span>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default BootScreen;
