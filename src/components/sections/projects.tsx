import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { icons } from "@/constants/icons";
import { skillsIcon } from "@/constants/skills";
import { projects, type TranslateData } from "@/data/projects";

// Grid of project cards: cover image, translated title and
// short description, the tech icons used, and Demo / Github
// buttons. The old site chunked the cards into rows of three
// only to stagger the motion entrance; one responsive grid
// renders identically without it.
const Projects = () => {
	const t = useTranslations();

	const tProjects = t.raw("Projects") as TranslateData[];

	return (
		<ul className="projects grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{projects.map((proj, index) => {
				const translated = tProjects.find((item) => item.id === proj.id);

				return (
					<li
						key={proj.id}
						data-reveal
						data-once="true"
						data-delay={0.2 + (index % 3) * 0.05}
						className="reveal bg-linear-to-br from-surface-secondary/30 via-primary-lighter to-surface-secondary/30 hover:bg-surface-active p-4 rounded-sm border border-solid border-border-strong shadow-sm my-transition"
					>
						{/* Image */}
						<div className="w-full h-50 mb-4.5 rounded-sm border border-solid border-border-strong shadow-sm overflow-hidden">
							<Image
								src={proj.images[0]}
								alt={translated?.title ?? "project"}
								width={280}
								height={200}
								loading="lazy"
								className="w-full h-full"
							/>
						</div>

						{/* Title */}
						<h3 className="text-button font-bold text-text-primary">
							{translated?.title}
						</h3>

						{/* Short Description */}
						<p className="text-caption font-medium text-text-description mt-1.5 mb-3.5">
							{translated?.shortDescription}
						</p>

						{/* Skills */}
						<ul className="flex items-center gap-2.5">
							{proj.technicals.map((tech) => (
								<li key={tech} className="w-6 text-text-primary">
									{skillsIcon[tech]}
								</li>
							))}
						</ul>

						{/* Links */}
						<div className="flex items-center justify-between mt-5">
							<Link
								href={proj.demo}
								target="_blank"
								className="hover:bg-primary-light w-25 flex items-center justify-center gap-2.5 py-2 border border-solid border-primary rounded-xs shadow-sm my-transition"
							>
								<ExternalLink size={15} className="text-primary" />
								<span className="text-caption font-bold text-primary">
									Demo
								</span>
							</Link>

							<Link
								href={proj.github}
								target="_blank"
								className="hover:bg-surface-secondary w-25 flex items-center justify-center gap-2.5 py-2 border border-solid border-border-strong rounded-xs shadow-sm my-transition"
							>
								<span className="text-text-primary [&_svg]:w-4 [&_svg]:h-4">
									{icons.github}
								</span>
								<span className="text-caption font-bold text-text-primary">
									Github
								</span>
							</Link>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default Projects;
