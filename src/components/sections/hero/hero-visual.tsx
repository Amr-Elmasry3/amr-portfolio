import Image from "next/image";

import { icons } from "@/constants/icons";

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

			{/* Static badge chip hanging off the composition's
			    bottom corner */}
			<div className="absolute -bottom-5 start-4 flex items-center gap-2.5 rounded-md border border-solid border-border-strong bg-surface/85 px-3 py-2 shadow-md backdrop-blur">
				<span className="text-[18px] text-primary [&_svg]:size-[18px]">
					{icons["codeAlt"]}
				</span>

				<span className="flex flex-col leading-tight">
					<span className="text-[12px] font-bold text-text-primary">
						React.js & Next.js
					</span>
					<span className="text-[10px] font-medium text-text-description">
						Frontend Developer
					</span>
				</span>
			</div>
		</div>
	);
};

export default HeroVisual;
