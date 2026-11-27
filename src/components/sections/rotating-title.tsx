"use client";

import { useEffect, useState } from "react";

// The job title under the name: after the swarm has typed it
// once, it deletes itself and types the next title, cycling
// through the list — the same typing feel the page was built
// with. Never runs for visitors who prefer reduced motion.
interface RotatingTitleProps {
	titles: string[];
}

const TYPE_MS = 70;
const DELETE_MS = 32;
const HOLD_MS = 1900;
const START_DELAY_MS = 5000;

const RotatingTitle = ({ titles }: RotatingTitleProps) => {
	const [text, setText] = useState(titles[0] ?? "");

	useEffect(() => {
		if (titles.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			return;

		let word = 0;
		let char = titles[0].length;
		let deleting = true;
		let timer = 0;

		const tick = () => {
			let delay = deleting ? DELETE_MS : TYPE_MS;

			if (deleting) {
				char -= 1;
				if (char <= 0) {
					deleting = false;
					word = (word + 1) % titles.length;
					char = 0;
				}
			} else {
				char += 1;
				if (char >= titles[word].length) {
					char = titles[word].length;
					deleting = true;
					delay = HOLD_MS;
				}
			}

			setText(titles[word].slice(0, char));
			timer = window.setTimeout(tick, delay);
		};

		timer = window.setTimeout(tick, START_DELAY_MS);
		return () => window.clearTimeout(timer);
	}, [titles]);

	return (
		<h3
			className="text-button font-medium text-text-primary"
			aria-label={titles[0]}
		>
			<span aria-hidden="true">{text}</span>
			<span
				aria-hidden="true"
				className="title-caret ms-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.12em] bg-primary"
			></span>
		</h3>
	);
};

export default RotatingTitle;
