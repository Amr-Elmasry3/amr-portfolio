import Image from "next/image";

import HeroInfo from "@/components/sections/hero-info";

// Hero section: intro text on one side and the photo on the
// other (photo hidden on mobile, as in the previous version).
// The construction-draw overlay and swarm cursor from the old
// site are intentionally not ported yet — amr will revisit the
// reveal animations in his own way later.
const HeroSection = () => {
	return (
		<section
			className="hero-section flex items-center justify-baseline md:justify-between gap-0 md:gap-6 mb-12"
			role="banner"
		>
			{/* Hero Info */}
			<div className="flex-1 text-center md:text-start">
				<HeroInfo />
			</div>

			{/* Hero Image — amr's brand photo (transparent background,
			    so it sits directly on the page background wash) */}
			<div className="flex-1 hidden md:block">
				<Image
					src="/assets/IMG_20261110_201722.png"
					alt="Amr Elmasry"
					width={1299}
					height={941}
					priority
				/>
			</div>
		</section>
	);
};

export default HeroSection;
