import MySkills from "@/components/sections/skills/my-skills";
import SectionHeading from "@/components/shared/section-heading";

// Skills section: heading plus the skills grid.
const SkillsSection = () => {
	return (
		<section className="skills-section" id="skills">
			<SectionHeading sectionName="skills" />

			<MySkills />
		</section>
	);
};

export default SkillsSection;
