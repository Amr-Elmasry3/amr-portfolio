import { useTranslations } from "next-intl";

// The three About paragraphs, with highlighted phrases rendered
// in the accent gradient.
const AboutMe = () => {
	const t = useTranslations("About");

	const paragraphs = ["paragraph1", "paragraph2", "paragraph3"] as const;

	return (
		<ul className="about-me flex-1 flex flex-col gap-4">
			{paragraphs.map((key, index) => (
				<li key={key}>
					<p
						className={
							index === 0
								? "text-button font-medium text-text-secondary"
								: "text-caption font-medium text-text-description"
						}
					>
						{t.rich(key, {
							highlight: (chunks) => (
								<span className="gradient-text font-bold">{chunks}</span>
							),
						})}
					</p>
				</li>
			))}
		</ul>
	);
};

export default AboutMe;
