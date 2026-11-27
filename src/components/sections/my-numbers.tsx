import { useTranslations } from "next-intl";

import StateCard, { type StatNumber } from "@/components/sections/state-card";

// Grid of stat cards (years learning, projects, technologies,
// passion) driven by the About messages.
const MyNumbers = () => {
	const t = useTranslations("About");

	const numbers = t.raw("numbers") as StatNumber[];

	return (
		<ul className="my-numbers w-full flex-1 grid gap-4 grid-cols-1 min-[500px]:grid-cols-2">
			{numbers.map((num) => (
				<StateCard key={num.title} number={num} />
			))}
		</ul>
	);
};

export default MyNumbers;
