import Projects from "@/components/sections/projects/projects";
import SectionHeading from "@/components/shared/section-heading";

// Projects section: heading plus the project cards grid.
const ProjectsSection = () => {
	return (
		<section className="projects-section" id="projects">
			<SectionHeading sectionName="projects" />

			<Projects />
		</section>
	);
};

export default ProjectsSection;
