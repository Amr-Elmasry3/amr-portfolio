import { useTranslations } from "next-intl";

import QuickInfo from "@/components/sections/about/quick-info";

// The three About paragraphs, with highlighted phrases rendered
// in the accent gradient.
const AboutMe = () => {
	const t = useTranslations("About");

	const paragraphs = ["paragraph1", "paragraph2", "paragraph3"] as const;

	return (
		<div className="flex-1 flex flex-col gap-5">
			<ul className="about-me flex flex-col gap-4">
			{paragraphs.map((key) => (
				<li key={key}>
					<p className="text-caption font-medium text-text-description">
						{t.rich(key, {
							highlight: (chunks) => (
								<span className="gradient-text font-bold">{chunks}</span>
							),
						})}
					</p>
				</li>
			))}
			</ul>

			<QuickInfo />
		</div>
	);
};

export default AboutMe;
