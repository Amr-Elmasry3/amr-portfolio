"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// A small mouse outline at the bottom of the hero hinting that
// the page continues below; it fades away as soon as the
// visitor starts scrolling.
const ScrollHint = () => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY < 60);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<Link
			href="#about"
			aria-label="Scroll to about"
			className={`absolute bottom-5 left-1/2 -translate-x-1/2 my-transition ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
		>
			<span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-solid border-border-strong p-1.5">
				<span className="scroll-hint-dot h-2 w-1 rounded-full bg-primary"></span>
			</span>
		</Link>
	);
};

export default ScrollHint;
