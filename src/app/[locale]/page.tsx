import AboutSection from "@/components/sections/about-section";
import HeroSection from "@/components/sections/hero-section";
import SkillsSection from "@/components/sections/skills-section";

const Home = () => {
	return (
		<main className="space-y-24">
			<HeroSection />

			<AboutSection />

			<SkillsSection />
		</main>
	);
};

export default Home;
