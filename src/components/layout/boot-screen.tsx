"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLocale } from "next-intl";

const enLetters = ["A", "M", "R", " ", "E", "L", "M", "A", "S", "R", "Y"];
const arLetters = ["Y", "R", "S", "A", "M", "L", "E", " ", "R", "M", "A"];

interface BootScreenProps {
	onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
	const [isDone, setIsDone] = useState(false);
	const [isGone, setIsGone] = useState(false);
	const currentLocale = useLocale();

	useEffect(() => {
		const exitTimer = setTimeout(() => setIsDone(true), 1400);
		const completeTimer = setTimeout(onComplete, 1600);
		const goneTimer = setTimeout(() => setIsGone(true), 1800);

		return () => {
			clearTimeout(exitTimer);
			clearTimeout(completeTimer);
			clearTimeout(goneTimer);
		};
	}, [onComplete]);

	const letters = currentLocale === "en" ? enLetters : arLetters;

	if (isGone) return null;

	return (
		<div
			className={`fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-surface-secondary via-primary-lighter to-surface-secondary transition-all duration-400 ${
				isDone ? "pointer-events-none scale-105 opacity-0" : ""
			}`}
		>
			<div className="flex items-center gap-1">
				{letters.map((letter, i) => {
					// The Arabic name is still Latin letters, laid out from a
					// reversed array — but its animation must run in the same
					// direction as the English one: first letter first.
					const order =
						currentLocale === "en" ? i : letters.length - 1 - i;
					return (
						<span
							key={`${letter}-${i}`}
							className="boot-letter text-heading2 sm:text-heading1 font-bold gradient-text"
							style={
								{
									"--boot-x": `${(order - 5) * 12}px`,
									"--boot-rot":
										order % 2 === 0 ? "-15deg" : "15deg",
									animationDelay: `${order * 0.08}s`,
								} as CSSProperties
							}
						>
							{letter === " " ? "\u00A0" : letter}
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default BootScreen;
