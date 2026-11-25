import AboutMe from "@/components/sections/about-me";
import MyNumbers from "@/components/sections/my-numbers";
import SectionHeading from "@/components/shared/section-heading";

// About section: heading, the bio paragraphs and the numbers
// grid side by side on desktop, stacked on mobile.
const AboutSection = () => {
	return (
		<section className="about-section" id="about">
			<SectionHeading sectionName="about" />

			<div className="about-content flex flex-col md:flex-row items-center gap-4 gap-y-6">
				<AboutMe />

				<MyNumbers />
			</div>
		</section>
	);
};

export default AboutSection;
