// Work experience entries, newest first. Company and tech
// stack are static; role, location, period and the bullet
// points are translated in the messages (Experience.items,
// matched by id).
export interface ExperienceTech {
	icon: string;
	label: string;
}

export interface ExperienceItem {
	id: string;
	company: string;
	isCurrent: boolean;
	techs: ExperienceTech[];
}

export interface TranslatedExperience {
	id: string;
	role: string;
	location: string;
	period: string;
	points: string[];
}

export const experience: ExperienceItem[] = [
	{
		id: "elmo-tech",
		company: "Elmo Tech",
		isCurrent: true,
		techs: [
			{ icon: "React.js", label: "React" },
			{ icon: "Next.js", label: "Next.js" },
			{ icon: "Tailwind CSS", label: "Tailwind CSS" },
			{ icon: "Shadcn Ui", label: "Shadcn" },
			{ icon: "Axios", label: "Axios" },
			{ icon: "Zustand", label: "Zustand" },
		],
	},
];
