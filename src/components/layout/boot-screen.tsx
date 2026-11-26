"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

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

	if (isDone) return null;

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-surface-secondary via-primary-lighter to-surface-secondary">
			<div data-swarm-boot-name className="flex items-center gap-1">
				{letters.map((letter, i) => (
					<span
						key={`${letter}-${i}`}
						className="text-heading2 sm:text-heading1 font-bold gradient-text">
						{letter === " " ? "\u00A0" : letter}
					</span>
				))}
			</div>
		</div>
	);
};

export default BootScreen;
