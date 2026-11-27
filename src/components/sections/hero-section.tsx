import HeroInfo from "@/components/sections/hero-info";
import HeroVisual from "@/components/sections/hero-visual";
import ScrollHint from "@/components/sections/scroll-hint";

// Hero section: intro text on one side and the photo composition
// on the other. The composition needs room, so it stays hidden
// on mobile — phones get a small round avatar in the text block
// instead (see hero-info). The swarm builder paints it all in.
const HeroSection = () => {
	return (
		<section
			className="hero-section relative flex items-center justify-baseline md:justify-between gap-0 md:gap-6 mb-12 min-h-[calc(100dvh-7.5rem)]"
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

			<ScrollHint />
		</section>
	);
};

export default HeroSection;
