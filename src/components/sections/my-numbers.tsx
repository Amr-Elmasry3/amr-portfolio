import { useTranslations } from "next-intl";

import StateCard, { type StatNumber } from "@/components/sections/state-card";

// Grid of stat cards (years learning, projects, technologies,
// passion) driven by the About messages.
const MyNumbers = () => {
	const t = useTranslations("About");

	const numbers = t.raw("numbers") as StatNumber[];

	return (
		<ul className="my-numbers w-full flex-1 grid gap-2 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
			{numbers.map((num, index) => (
				<StateCard key={num.title} number={num} index={index} />
			))}
		</ul>
	);
};

export default MyNumbers;
