import { useTranslations } from "next-intl";

// Centered badge heading shown at the top of every section,
// with the two dot-and-line connectors on its top edge. The
// old site animated the connectors drawing in with the motion
// framework; this port renders them statically.
export type SectionName = "about" | "skills" | "projects" | "contact";

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

				{/* Connectors */}
				<div className="absolute -top-6.5 w-full flex justify-between px-6">
					{[0, 1].map((i) => (
						<div key={i} className="flex flex-col items-center">
							<span className="w-1.5 h-1.5 outline-2 outline-primary rounded-full flex items-center justify-center">
								<span className="w-1 h-1 bg-primary rounded-full"></span>
							</span>

							<span className="w-0.5 h-7 bg-primary"></span>

							<span className="w-1.5 h-1.5 outline-2 outline-primary rounded-full flex items-center justify-center">
								<span className="w-1 h-1 bg-primary rounded-full"></span>
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SectionHeading;
