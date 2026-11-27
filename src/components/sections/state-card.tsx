"use client";

import { useEffect, useRef, useState } from "react";

import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { icons } from "@/constants/icons";
import { useCountUp } from "@/hooks/use-count-up";

// One stat tile in the About numbers grid. The count-up is
// chained to the swarm: it starts the moment a cursor begins
// typing the number, so the digits roll as they are written.
// Without a swarm on the page (reduced motion), an
// IntersectionObserver starts it instead, as before.
export interface StatNumber {
	title: string;
	number: string;
	icon: string;
}

interface StateCardProps {
	number: StatNumber;
}

const StateCard = ({ number }: StateCardProps) => {
	const ref = useRef<HTMLLIElement>(null);
	const numberRef = useRef<HTMLSpanElement>(null);
	const [started, setStarted] = useState(false);

	const { count, suffix } = useCountUp({
		value: number.number,
		started,
	});

	useEffect(() => {
		const el = ref.current;
		const numberEl = numberRef.current;
		if (!el || !numberEl) return;

		let safetyTimer = 0;

		const start = () => {
			window.clearTimeout(safetyTimer);
			setStarted(true);
			mutationObserver.disconnect();
			observer.disconnect();
		};

		// The number span becoming "building" is the cursor
		// starting to type it — that is the count's cue. The
		// attribute disappearing means it already finished.
		const mutationObserver = new MutationObserver(() => {
			if (numberEl.getAttribute("data-swarm-state") !== "pending")
				start();
		});
		mutationObserver.observe(numberEl, {
			attributes: true,
			attributeFilter: ["data-swarm-state"],
		});

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				// No swarm on this page: count as soon as seen.
				// Otherwise wait for the cursor; the safety timer
				// only guards against a missed mutation.
				if (!document.documentElement.hasAttribute("data-swarm"))
					start();
				else safetyTimer = window.setTimeout(start, 4000);
			},
			{ threshold: 0.2 },
		);

		observer.observe(el);
		return () => {
			window.clearTimeout(safetyTimer);
			mutationObserver.disconnect();
			observer.disconnect();
		};
	}, []);

	return (
		<li ref={ref} className="my-transition hover:-translate-y-1">
			<SmallBoxWrapper>
				<div className="flex flex-col items-center gap-1.5">
					<span className="flex size-11 items-center justify-center rounded-full bg-primary-light text-primary [&_svg]:w-[22px] [&_svg]:h-[22px]">
						{icons[number.icon]}
					</span>

					<span
						ref={numberRef}
						className="text-subHeading font-extrabold text-primary-active"
					>
						{count} {suffix}
					</span>

					<span className="text-smallCaption font-medium text-text-description">
						{number.title}
					</span>
				</div>
			</SmallBoxWrapper>
		</li>
	);
};

export default StateCard;
