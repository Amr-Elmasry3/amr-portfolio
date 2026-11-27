"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import AccentSwitch from "@/components/shared/accent-switch";
import SwitchLanguage from "./switch-language";
import ThemeToggle from "./theme-toggle";

// Sticky header: transparent over the top of the page; once the
// visitor scrolls, it detaches into a floating rounded glass bar
// (with a hairline reading-progress line in the accent colour
// along its bottom edge), so the settings stay reachable from
// anywhere without the bar ever hugging the screen edges.
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
			className={`sticky top-3 z-50 flex items-center justify-between gap-2 mb-10 border border-solid my-transition ${scrolled ? "rounded-2xl border-border-strong bg-background/80 px-4 pt-3 pb-3 shadow-lg backdrop-blur-xl" : "border-transparent pt-4 pb-3.5"}`}>
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
			<div className="settings flex items-center gap-1 rounded-full border border-solid border-border-strong bg-surface-secondary/70 px-1 py-1 shadow-sm backdrop-blur">
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
				className={`absolute bottom-1.5 start-4 end-4 h-0.5 w-auto origin-left rounded-full bg-primary my-transition rtl:origin-right ${scrolled ? "opacity-100" : "opacity-0"}`}
				style={{ transform: "scaleX(0)" }}></div>
		</header>
	);
};

export default Header;
