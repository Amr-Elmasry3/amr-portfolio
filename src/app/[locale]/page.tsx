import AboutSection from "@/components/sections/about/about-section";
import ContactSection from "@/components/sections/contact/contact-section";
import ExperienceSection from "@/components/sections/experience/experience-section";
import HeroSection from "@/components/sections/hero/hero-section";
import ProjectsSection from "@/components/sections/projects/projects-section";
import SkillsSection from "@/components/sections/skills/skills-section";

const Home = () => {
	return (
		<main className="home-page space-y-24 pb-24">
			<HeroSection />

			<AboutSection />

			<ExperienceSection />

			<SkillsSection />

			<ProjectsSection />

			<ContactSection />
		</main>
	);
};

export default Home;
