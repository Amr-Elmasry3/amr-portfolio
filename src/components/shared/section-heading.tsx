import { useTranslations } from "next-intl";

// Centered badge heading shown at the top of every section,
// with the two dot-and-line connectors on its top edge. The
// connectors are small SVGs the swarm traces in (data-swarm-draw)
// when it builds the heading.
export type SectionName =
	| "about"
	| "experience"
	| "skills"
	| "projects"
	| "contact";

interface SectionHeadingProps {
	sectionName: SectionName;
}

const SectionHeading = ({ sectionName }: SectionHeadingProps) => {
	const t = useTranslations("SectionsHeading");

	return (
		<div className="section-heading mb-8 flex justify-center">
			<div className="relative w-60 border border-solid border-border-strong py-2 rounded-sm shadow-md bg-linear-to-br from-surface-secondary/30 via-primary-lighter to-surface-secondary/30">
				<p className="flex items-center justify-center gap-2 text-subHeading font-bold text-text-primary">
					{t.rich(sectionName, {
						highlight: (chunks) => (
							<span className="gradient-text underline underline-offset-2">
								{chunks}
							</span>
						),
					})}
				</p>

				{/* Connectors — dot, line, dot; the swarm traces them */}
				<div className="absolute -top-6.5 w-full flex justify-between px-6">
					{[0, 1].map((i) => (
						<svg
							key={i}
							data-swarm-draw
							aria-hidden="true"
							className="h-10 w-3 overflow-visible"
							viewBox="0 0 12 40"
							fill="none"
						>
							<circle
								cx="6"
								cy="4"
								r="2.75"
								pathLength={1}
								strokeDasharray={1}
								className="hero-draw-stroke"
								stroke="var(--primary)"
								strokeWidth="1.5"
							/>
							<circle
								cx="6"
								cy="4"
								r="2"
								className="hero-draw-fill"
								fill="var(--primary)"
							/>
							<line
								x1="6"
								y1="8"
								x2="6"
								y2="32"
								pathLength={1}
								strokeDasharray={1}
								className="hero-draw-stroke"
								stroke="var(--primary)"
								strokeWidth="2"
							/>
							<circle
								cx="6"
								cy="36"
								r="2.75"
								pathLength={1}
								strokeDasharray={1}
								className="hero-draw-stroke"
								stroke="var(--primary)"
								strokeWidth="1.5"
							/>
							<circle
								cx="6"
								cy="36"
								r="2"
								className="hero-draw-fill"
								fill="var(--primary)"
							/>
						</svg>
					))}
				</div>
			</div>
		</div>
	);
};

export default SectionHeading;
