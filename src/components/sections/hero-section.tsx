import Image from "next/image";

import HeroDecorations from "@/components/sections/hero-decorations";
import HeroInfo from "@/components/sections/hero-info";

// Hero section: intro text on one side and the photo on the
// other (photo hidden on mobile, as in the previous version).
// The swarm builder draws the whole composition in, photo,
// logo and decorations included.
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

			{/* Hero Image — two layers on the original 1299x941
			    canvas: the AE logo artwork extracted from the old
			    composite, used as a mask over an accent gradient
			    (so the original mark recolors with the accent), and
			    amr's clean cutout photo on top, offset to the exact
			    position it held in the composite. An accent glow
			    sits behind and the composition fades out at the
			    bottom so it never looks cropped. */}
			<div className="flex-1 hidden md:block">
				<div className="relative">
					<div aria-hidden="true" className="hero-photo-glow"></div>

					<HeroDecorations />

					<div className="hero-fade relative aspect-[1299/941]">
						<div aria-hidden="true" className="hero-logo-fill absolute inset-0"></div>

						<Image
							data-swarm-paint
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
