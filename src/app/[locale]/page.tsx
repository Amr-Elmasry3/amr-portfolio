import AboutSection from "@/components/sections/about-section";
import ContactSection from "@/components/sections/contact-section";
import HeroSection from "@/components/sections/hero-section";
import ProjectsSection from "@/components/sections/projects-section";
import SkillsSection from "@/components/sections/skills-section";
import RevealObserver from "@/components/shared/reveal-observer";

const Home = () => {
	return (
		<main className="space-y-24 pb-24">
			<RevealObserver />
			<HeroSection />

			<AboutSection />

			<SkillsSection />

			<ProjectsSection />

			<ContactSection />
		</main>
	);
};

export default Home;
