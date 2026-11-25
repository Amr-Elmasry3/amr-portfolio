"use client";

import { useEffect, useRef, useState } from "react";

export const useActiveSection = (sectionLinks: string[]) => {
	const [activeHref, setActiveHref] = useState("#");
	const manualSelectionTimeout = useRef<number | null>(null);
	const isManualSelection = useRef(false);

	useEffect(() => {
		const sections = sectionLinks
			.map((link) => link.replace("#", ""))
			.filter(Boolean)
			.map((id) => document.getElementById(id))
			.filter((section): section is HTMLElement => section !== null);

		const updateActiveSection = () => {
			if (isManualSelection.current) return;

			if (window.scrollY <= 1) {
				setActiveHref("#");
				return;
			}

			const readingPoint = window.scrollY + window.innerHeight * 0.3;
			const currentSection = sections.reduce<HTMLElement | null>(
				(activeSection, section) => {
					const sectionTop =
						section.getBoundingClientRect().top + window.scrollY;
					return sectionTop <= readingPoint ? section : activeSection;
				},
				null,
			);

			if (currentSection) setActiveHref(`#${currentSection.id}`);
		};

		updateActiveSection();
		window.addEventListener("scroll", updateActiveSection, {
			passive: true,
		});
		window.addEventListener("resize", updateActiveSection);

		return () => {
			window.removeEventListener("scroll", updateActiveSection);
			window.removeEventListener("resize", updateActiveSection);
			if (manualSelectionTimeout.current) {
				window.clearTimeout(manualSelectionTimeout.current);
			}
		};
	}, [sectionLinks]);

	const selectSection = (href: string) => {
		setActiveHref(href);
		isManualSelection.current = true;

		if (manualSelectionTimeout.current) {
			window.clearTimeout(manualSelectionTimeout.current);
		}

		manualSelectionTimeout.current = window.setTimeout(() => {
			isManualSelection.current = false;
		}, 700);
	};

	return { activeHref, selectSection };
};
