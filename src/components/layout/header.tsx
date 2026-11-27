"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import AccentSwitch from "@/components/shared/accent-switch";
import SwitchLanguage from "./switch-language";
import ThemeToggle from "./theme-toggle";

// Sticky header: transparent over the top of the page; once the
// visitor scrolls, it turns into a glass bar with a hairline
// reading-progress line in the accent colour along its bottom
// edge, so the settings stay reachable from anywhere.
const Header = () => {
	const [scrolled, setScrolled] = useState(false);
	const progressRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY;
			setScrolled((prev) => (prev === y > 8 ? prev : y > 8));

			const max =
				document.documentElement.scrollHeight - window.innerHeight;
			const p = max > 0 ? Math.min(y / max, 1) : 0;
			if (progressRef.current)
				progressRef.current.style.transform = `scaleX(${p})`;
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 flex items-center justify-between gap-2 pt-6 pb-3.5 mb-10 border-b border-solid my-transition ${scrolled ? "border-border-strong bg-background/75 shadow-sm backdrop-blur-md" : "border-transparent"}`}
		>
			{/* Logo */}
			<div>
				<Image
					src="/assets/logo.png"
					alt="Amr Elmasry"
					width={70}
					height={30}
					priority
				/>
			</div>

			{/* Settings — one pill holding the three controls */}
			<div className="settings flex items-center gap-1 rounded-full border border-solid border-border-strong bg-surface-secondary/70 px-1.5 py-1 shadow-sm backdrop-blur">
				{/* Switch Language */}
				<SwitchLanguage />

				{/* Accent Colors */}
				<AccentSwitch />

				{/* Switch Mode */}
				<ThemeToggle />
			</div>

			{/* Reading progress */}
			<div
				ref={progressRef}
				aria-hidden="true"
				className={`absolute bottom-0 start-0 h-0.5 w-full origin-left bg-primary my-transition rtl:origin-right ${scrolled ? "opacity-100" : "opacity-0"}`}
				style={{ transform: "scaleX(0)" }}
			></div>
		</header>
	);
};

export default Header;
