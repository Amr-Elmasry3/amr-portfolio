"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { icons } from "@/constants/icons";
import { useActiveSection } from "@/hooks/use-active-section";

interface SidebarLink {
	title: string;
	icon: string;
	href: string;
}

const Sidebar = () => {
	const t1 = useTranslations("Sidebar");

	const links = useMemo(() => t1.raw("links") as SidebarLink[], [t1]);
	const sectionLinks = useMemo(
		() => links.map((link) => link.href),
		[links],
	);

	const { activeHref, selectSection } = useActiveSection(sectionLinks);

	return (
		<aside
			className={`sidebar fixed z-80 bottom-0 start-0 w-full sm:w-auto h-auto sm:h-screen flex items-end sm:items-center`}>
			<nav
				className={`rounded-t-md sm:rounded-none sm:rounded-e-sm w-full flex flex-row sm:flex-col justify-around gap-3.5 [background-color:var(--sidebar-background)] py-3 px-2 border border-solid border-border-strong shadow-sm my-transition`}
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
								{/* Active mark: a bar on the screen-edge side
								    (top edge of the mobile bottom bar) */}
								{isActive && (
									<>
										<span className="hidden sm:block absolute top-1/2 -translate-y-1/2 -start-2 h-5 w-1 rounded-full bg-primary"></span>
										<span className="sm:hidden absolute -top-[13px] left-1/2 -translate-x-1/2 h-1 w-5 rounded-full bg-primary"></span>
									</>
								)}

								{/* Icon */}
								<span
									className={`${isActive ? "text-primary-active" : "text-text-description group-hover:text-primary-active"} block text-[20px] [&_svg]:size-5 my-transition`}>
									{icons[link.icon]}
								</span>

								{/* Popup (desktop hover) */}
								<span
									className={`hidden sm:group-hover:block absolute start-full ms-2.5 w-max text-[11px] font-bold text-text-description top-1/2 -translate-y-1/2 bg-surface-secondary py-1 px-1.5 border border-solid border-primary-border rounded-xs shadow-xs`}>
									{link.title}

									<span
										className={`absolute -start-2.5 w-2.5 h-0.5 bg-primary-border top-1/2 -translate-y-1/2`}></span>
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
