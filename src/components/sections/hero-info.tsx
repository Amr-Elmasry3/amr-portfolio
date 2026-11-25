import Link from "next/link";
import { useTranslations } from "next-intl";

import HeroButtons from "@/components/sections/hero-buttons";
import { icons } from "@/constants/icons";
import { socialLinks } from "@/constants/social-links";

// Hero text block: greeting, name, title, description, status and
// location badges, CTA buttons and the social links row.
const HeroInfo = () => {
	const t = useTranslations("HomePage");

	const name = t.raw("name") as { first: string; second: string };

	return (
		<div className="hero-info">
			{/* Details */}
			<div className="flex flex-col items-center md:items-start">
				{/* Hello */}
				<span className="text-[18px] text-text-primary">{t("hello")}</span>

				{/* Name */}
				<h1 className="text-[40px] sm:text-heading1 font-bold text-text-primary mt-2 mb-1.5 flex items-center justify-center md:justify-start gap-2.5">
					{name.first}{" "}
					<span className="gradient-text flex items-end">
						{name.second}{" "}
						<span className="w-4 h-1 bg-linear-to-r from-primary via-primary-active to-primary"></span>
					</span>
				</h1>

				{/* Title */}
				<h3 className="text-button font-medium text-text-primary">
					{t("title")}
				</h3>

				{/* Description */}
				<p className="text-[13px] font-medium text-text-description mt-3.5 mb-5.5 max-w-[95%] xxs:max-w-[75%] sm:max-w-[60%]">
					{t.rich("description", {
						highlight: (chunks) => (
							<span className="gradient-text font-bold">{chunks}</span>
						),
					})}
				</p>

				{/* Status & Location */}
				<div className="flex items-center justify-center md:justify-start xxs:gap-2 gap-4">
					{/* Status */}
					<div className="w-max flex items-center gap-2 bg-transparent py-2.5 px-3 border border-solid border-border-strong rounded-sm shadow-xs">
						<span className="w-2 h-2 bg-success rounded-full"></span>

						<span className="text-smallCaption xxs:text-[13px] font-bold text-text-secondary">
							{t("status")}
						</span>
					</div>

					{/* Location */}
					<div className="w-max flex items-center gap-2 bg-transparent py-2.5 px-3 border border-solid border-border-strong rounded-sm shadow-xs">
						<span className="text-[13px] text-primary-active">
							{icons["location"]}
						</span>

						<span className="text-smallCaption xxs:text-[13px] font-bold text-text-secondary">
							{t("location")}
						</span>
					</div>
				</div>
			</div>

			{/* Buttons */}
			<HeroButtons />

			{/* Social links */}
			<div className="found-me">
				<span className="text-smallCaption font-bold text-text-secondary">
					{t("foundMe")}
				</span>

				<ul className="social-links mt-2.5 flex items-center justify-center md:justify-start gap-3">
					{socialLinks.map((link) => (
						<li key={link.title}>
							<Link
								href={link.href}
								aria-label={link.title}
								className="bg-transparent hover:bg-primary-light w-10 h-10 flex items-center justify-center text-xl text-text-secondary hover:text-primary-active border border-solid border-border-strong hover:border-primary-border rounded-sm shadow-sm my-transition"
								target="_blank"
							>
								{icons[link.icon]}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default HeroInfo;
