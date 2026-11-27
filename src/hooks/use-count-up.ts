"use client";

import { useEffect, useState } from "react";

// Counts from 0 to the numeric part of a stat value (e.g. "12+"
// or "100%") once `started` flips true, returning the current
// count and the non-numeric suffix separately. Ported from the
// previous version of the site.
interface UseCountUpOptions {
	value: string;
	started: boolean;
}

export const useCountUp = ({ value, started }: UseCountUpOptions) => {
	const numericValue = Number.parseInt(value, 10);
	const suffix = value.slice(String(numericValue).length);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!started) return;

		const startTime = performance.now();
		// Roughly the time the swarm spends typing the number, so
		// the digits finish rolling about when the caret passes.
		const duration = 650;
		let frame = 0;

		const updateCount = (currentTime: number) => {
			const progress = Math.min((currentTime - startTime) / duration, 1);
			setCount(Math.round(progress * numericValue));

			if (progress < 1) frame = requestAnimationFrame(updateCount);
		};

		frame = requestAnimationFrame(updateCount);
		return () => cancelAnimationFrame(frame);
	}, [numericValue, started]);

	return { count, suffix };
};
