import HeroInfo from "@/components/sections/hero-info";
import HeroVisual from "@/components/sections/hero-visual";

// Hero section: intro text on one side and the photo composition
// on the other (photo hidden on mobile, as in the previous
// version). The swarm builder paints the whole composition in.
const HeroSection = () => {
	return (
		<section
			className="hero-section flex items-center justify-baseline md:justify-between gap-0 md:gap-6 mb-12 min-h-[calc(100dvh-7.5rem)]"
			role="banner"
		>
			{/* Hero Info */}
			<div className="flex-1 text-center md:text-start">
				<HeroInfo />
			</div>

			{/* Hero Image */}
			<div className="flex-1 hidden md:block">
				<HeroVisual />
			</div>
		</section>
	);
};

export default HeroSection;
