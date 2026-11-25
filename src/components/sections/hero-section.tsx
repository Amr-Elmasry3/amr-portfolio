import Image from "next/image";

import HeroInfo from "@/components/sections/hero-info";

// Hero section: intro text over a full-height visual. The
// photo + logo composition spans the whole height of the view
// (anchored to the end side), with the text layered above it.
// On mobile the composition is hidden, as in the previous
// version. The construction-draw overlay and swarm cursor from
// the old site are intentionally not ported yet — amr will
// revisit the reveal animations in his own way later.
const HeroSection = () => {
	return (
		<section
			className="hero-section relative flex items-center mb-12 overflow-x-clip md:min-h-[calc(100dvh-7rem)]"
			role="banner"
		>
			{/* Hero Info */}
			<div className="relative z-10 flex-1 text-center md:flex-none md:w-[52%] md:text-start">
				<HeroInfo />
			</div>

			{/* Hero Image — two layers on the original 1299x941
			    canvas: the AE logo artwork extracted from the old
			    composite, used as a mask over an accent gradient
			    (so the original mark recolors with the accent), and
			    amr's clean cutout photo on top, offset to the exact
			    position it held in the composite. An accent glow
			    sits behind and the composition fades out at the
			    bottom so it never looks cropped. */}
			<div className="absolute top-0 bottom-0 end-0 hidden aspect-[1299/941] md:block">
				<div className="relative h-full">
					<div aria-hidden="true" className="hero-photo-glow"></div>

					<div className="hero-fade relative h-full">
						<div aria-hidden="true" className="hero-logo-fill absolute inset-0"></div>

						<Image
							src="/assets/hero-image.png"
							alt="Amr Elmasry"
							width={729}
							height={941}
							priority
							className="absolute top-0 left-[32.02%] h-full w-auto"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
