import Image from "next/image";

import HeroInfo from "@/components/sections/hero-info";
import HeroLogo from "@/components/sections/hero-logo";

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

			{/* Hero Image — amr's cutout photo over the AE logo redrawn
			    as SVG (so the logo follows the accent color), with an
			    accent glow behind and a gentle float. The composition
			    fades out at the bottom so the photo never looks
			    cropped. The original composite photo is kept in
			    public/assets in case amr finds his layered source. */}
			<div className="flex-1 hidden md:block">
				<div className="relative">
					<div aria-hidden="true" className="hero-photo-glow"></div>

					<div className="hero-fade animate-float-soft relative">
						<HeroLogo />

						<Image
							src="/assets/amr-cutout.png"
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
