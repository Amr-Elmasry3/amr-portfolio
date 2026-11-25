"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { icons } from "@/constants/icons";
import { useActiveSection } from "@/hooks/use-active-section";

interface SidebarLink {
	title: string;
	icon: string;
	href: string;
}

const Sidebar = () => {
	const t1 = useTranslations("Sidebar");
	const currentLocale = useLocale();

	const links = useMemo(() => t1.raw("links") as SidebarLink[], [t1]);
	const sectionLinks = useMemo(
		() => links.map((link) => link.href),
		[links],
	);

	const { activeHref, selectSection } = useActiveSection(sectionLinks);

	const isArabic = currentLocale === "ar";

	return (
		<aside
			className={`sidebar fixed z-80 bottom-0 w-full sm:w-auto h-auto sm:h-screen ${isArabic ? "right-0" : "left-0"} flex items-end sm:items-center`}>
			<nav
				className={`rounded-tr-md rounded-tl-md ${isArabic ? "sm:rounded-none sm:rounded-tl-sm sm:rounded-bl-sm" : "sm:rounded-none sm:rounded-tr-sm sm:rounded-br-sm"} w-full flex flex-row sm:flex-col justify-around gap-3.5 bg-surface-secondary py-3 px-2 border border-solid border-border-strong shadow-sm`}
				role="navigation">
				{links.map((link) => {
					const isActive = activeHref === link.href;

					return (
						<div key={link.href} className="relative">
							<Link
								href={link.href}
								aria-label={link.title}
								onClick={() => selectSection(link.href)}
								className={`group relative block ${isActive ? "bg-primary-light border-primary-border" : "bg-transparent border-border hover:bg-primary-light hover:border-primary-border"} p-2 border border-solid rounded-sm shadow-xs my-transition`}>
								{/* Icon */}
								<span
									className={`${isActive ? "text-primary-active" : "text-text-description group-hover:text-primary-active"} block text-[22px] my-transition`}>
									{icons[link.icon]}
								</span>

								{/* Popup */}
								<span
									className={`${isArabic ? "right-0 -translate-x-11.75!" : "-right-2.5 translate-x-full"} hidden xxs:group-hover:block absolute w-max text-[11px] font-bold text-text-description top-[50%] translate-y-[-50%] translate-x-full bg-surface-secondary py-1 px-1.5 border border-solid border-primary-border rounded-xs shadow-xs`}>
									{link.title}

									<span
										className={`${isArabic ? "right-0 translate-x-full" : "left-0 -translate-x-full"} absolute w-2.5 h-0.5 bg-primary-border top-[50%] translate-y-[-50%]`}></span>
								</span>
							</Link>
						</div>
					);
				})}
			</nav>
		</aside>
	);
};

export default Sidebar;
