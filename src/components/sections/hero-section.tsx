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

			{/* Hero Image — amr's composite brand photo (him over his
			    AE logo), with an accent glow behind and a gentle
			    float. The composition fades out at the bottom so the
			    photo never looks cropped. Splitting it into a clean
			    cutout + a recolorable logo layer is planned once amr
			    provides the photo without the logo baked in. */}
			<div className="flex-1 hidden md:block">
				<div className="relative">
					<div aria-hidden="true" className="hero-photo-glow"></div>

					<div className="hero-fade animate-float-soft relative">
						<Image
							src="/assets/IMG_20261110_201722.png"
							alt="Amr Elmasry"
							width={1299}
							height={941}
							priority
							className="relative"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
