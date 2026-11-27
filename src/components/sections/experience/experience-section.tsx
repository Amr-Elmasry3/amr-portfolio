import Experience from "@/components/sections/experience/experience";
import SectionHeading from "@/components/shared/section-heading";

// Experience section: heading plus the timeline.
const ExperienceSection = () => {
	return (
		<section className="experience-section" id="experience">
			<SectionHeading sectionName="experience" />

			<Experience />
		</section>
	);
};

export default ExperienceSection;
