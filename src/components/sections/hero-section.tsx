import HeroInfo from "@/components/sections/hero-info";
import HeroVisual from "@/components/sections/hero-visual";

// Hero section: intro text on one side and the photo composition
// on the other; on mobile the composition shrinks and sits above
// the text instead of disappearing. The swarm builder paints the
// whole composition in.
const HeroSection = () => {
	return (
		<section
			className="hero-section flex flex-col md:flex-row items-center justify-center md:justify-between gap-0 md:gap-6 mb-12 min-h-[calc(100dvh-7.5rem)]"
			role="banner"
		>
			{/* Hero Info */}
			<div className="flex-1 text-center md:text-start">
				<HeroInfo />
			</div>

			{/* Hero Image */}
			<div className="order-first md:order-none w-full max-w-64 xxs:max-w-72 mx-auto mb-10 md:mb-0 md:max-w-none md:flex-1">
				<HeroVisual />
			</div>
		</section>
	);
};

export default HeroSection;
