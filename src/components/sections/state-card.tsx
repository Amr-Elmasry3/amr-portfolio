"use client";

import { useEffect, useRef, useState } from "react";

import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { icons } from "@/constants/icons";
import { useCountUp } from "@/hooks/use-count-up";

// One stat tile in the About numbers grid. The number counts up
// the first time the card scrolls into view (the old site
// chained this to the motion entrance animation; here an
// IntersectionObserver does the trigger instead).
export interface StatNumber {
	title: string;
	number: string;
	icon: string;
}

interface StateCardProps {
	number: StatNumber;
	index: number;
}

const StateCard = ({ number, index }: StateCardProps) => {
	const ref = useRef<HTMLLIElement>(null);
	const [started, setStarted] = useState(false);

	const { count, suffix } = useCountUp({
		value: number.number,
		started,
	});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setStarted(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<li ref={ref} data-reveal data-once="true" data-delay={index * 0.1} className="reveal">
			<SmallBoxWrapper>
				<div className="flex flex-col items-center gap-1">
					<span className="text-[26px] text-primary [&_svg]:w-[26px] [&_svg]:h-[26px]">
						{icons[number.icon]}
					</span>

					<span className="text-subHeading font-extrabold text-primary-active">
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
