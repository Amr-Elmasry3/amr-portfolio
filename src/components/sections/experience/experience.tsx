import { Building2, CalendarDays, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { skillsIcon } from "@/constants/skills";
import { experience, type TranslatedExperience } from "@/data/experience";

// Experience timeline: a rail on the start side whose node
// the swarm traces in (the same draw treatment as the
// heading connectors), with one card per role beside it.
const Experience = () => {
	const t = useTranslations("Experience");

	const translated = t.raw("items") as TranslatedExperience[];

	return (
		<ul className="flex flex-col gap-8">
			{experience.map((item) => {
				const text = translated.find((entry) => entry.id === item.id);

				const initials = item.company
					.split(" ")
					.map((word) => word[0])
					.join("");

				return (
					<li key={item.id} className="flex gap-4 sm:gap-6">
						{/* Rail: traced node over a fading line */}
						<div className="flex flex-col items-center self-stretch pt-1">
							<svg
								data-swarm-draw
								aria-hidden="true"
								className="h-6 w-6 shrink-0 overflow-visible"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									cx="12"
									cy="12"
									r="8.5"
									pathLength={1}
									strokeDasharray={1}
									className="hero-draw-stroke"
									stroke="var(--primary)"
									strokeWidth="2"
								/>
								<circle
									cx="12"
									cy="12"
									r="4.5"
									className="hero-draw-fill"
									fill="var(--primary)"
								/>
							</svg>

							<span className="mt-1 w-0.5 flex-1 rounded-full bg-linear-to-b from-primary/50 via-primary/20 to-transparent" />
						</div>

						{/* Role card */}
						<div className="min-w-0 flex-1">
							<SmallBoxWrapper>
								<div className="flex gap-4">
									<span className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-solid border-primary-border bg-primary-light text-[17px] font-black tracking-wide text-primary">
										{initials}
									</span>

									<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
										<h3 className="text-[17px] font-bold text-text-primary">
											{text?.role}
										</h3>

										{item.isCurrent && (
											<span className="flex items-center gap-1.5 rounded-full border border-solid border-success/40 bg-success/10 px-2.5 py-0.5 text-smallCaption font-bold text-success">
												<span className="relative flex size-1.5">
													<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none"></span>
													<span className="relative inline-flex size-1.5 rounded-full bg-success"></span>
												</span>
												{t("current")}
											</span>
										)}

										<span className="ms-auto flex items-center gap-1.5 rounded-full border border-solid border-border-strong bg-surface-secondary px-2.5 py-0.5 text-smallCaption font-bold text-text-secondary">
											<CalendarDays className="size-3.5" />
											{text?.period}
										</span>
									</div>

									<p className="mt-1.5 flex items-center gap-1.5 text-caption font-bold text-primary">
										<Building2 className="size-4" />
										{item.company}
									</p>

									<div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-smallCaption font-medium text-text-secondary">
										<span className="flex items-center gap-1">
											<MapPin className="size-3.5" />
											{text?.location}
										</span>
									</div>

									<ul className="mt-3.5 flex flex-col gap-1.5">
										{text?.points.map((point) => (
											<li
												key={point}
												className="flex gap-2 text-caption font-medium leading-relaxed text-text-description"
											>
												<span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary" />
												{point}
											</li>
										))}
									</ul>

									<ul className="mt-4 flex flex-wrap gap-2">
										{item.techs.map((tech) => (
											<li
												key={tech.label}
												className="flex items-center gap-1.5 rounded-full border border-solid border-border-strong bg-surface-secondary px-2.5 py-1 text-smallCaption font-bold text-text-secondary"
											>
												<span className="w-4 text-text-primary [&_svg]:size-4">
													{skillsIcon[tech.icon]}
												</span>
												{tech.label}
											</li>
										))}
									</ul>
									</div>
								</div>
							</SmallBoxWrapper>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default Experience;
