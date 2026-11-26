import AboutSection from "@/components/sections/about-section";
import ContactSection from "@/components/sections/contact-section";
import HeroSection from "@/components/sections/hero-section";
import ProjectsSection from "@/components/sections/projects-section";
import SkillsSection from "@/components/sections/skills-section";

const Home = () => {
	return (
		<main className="home-page space-y-24 pb-24">
			<HeroSection />

			<AboutSection />

			<SkillsSection />

			<ProjectsSection />

			<ContactSection />
		</main>
	);
};

export default Home;
