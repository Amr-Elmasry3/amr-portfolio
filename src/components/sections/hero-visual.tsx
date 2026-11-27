import Image from "next/image";

// The hero photo composition, on the original artwork's canvas:
// the AE logo (extracted from the old composite as a mask, so it
// recolours with the accent gradient) with amr's clean cutout on
// top at the exact spot it held in the composite — the cutout's
// silhouette starts 32.02% across the canvas and spans its full
// height. An accent glow sits behind the composition and it
// fades out at the bottom so it never looks cropped.
const CANVAS_RATIO = "1299 / 941";
const PHOTO_LEFT = "32.02%";

const HeroVisual = () => {
	return (
		<div className="relative">
			<div aria-hidden="true" className="hero-photo-glow"></div>

			<div
				className="hero-fade relative"
				style={{ aspectRatio: CANVAS_RATIO }}
			>
				<div
					aria-hidden="true"
					className="hero-logo-fill absolute inset-0"
				></div>

				<Image
					data-swarm-paint
					src="/assets/hero-image.png"
					alt="Amr Elmasry"
					width={729}
					height={941}
					priority
					className="absolute top-0 h-full w-auto"
					style={{ left: PHOTO_LEFT }}
				/>
			</div>
		</div>
	);
};

export default HeroVisual;
