"use client";

import { useEffect } from "react";

// Drives the CSS reveal system (src/styles/reveal.css): watches
// every [data-reveal] element and adds .is-visible when 20% of
// it enters the viewport, mirroring the old whileInView amount.
// Elements with data-once reveal a single time and then have
// their reveal classes stripped once the entrance finishes, so
// hover transitions on cards stay native; the rest replay every
// time they re-enter, as the old variants did. Observation only
// starts once the boot screen overlay is gone, so the hero
// entrance is not spent hidden behind it.
const RevealObserver = () => {
	useEffect(() => {
		const elements = Array.from(
			document.querySelectorAll<HTMLElement>("[data-reveal]"),
		);

		if (!("IntersectionObserver" in window)) {
			elements.forEach((el) => el.classList.add("is-visible"));
			return;
		}

		elements.forEach((el) => {
			el.style.setProperty("--reveal-delay", `${el.dataset.delay ?? "0"}s`);
		});

		let observer: IntersectionObserver | null = null;
		let pollId = 0;
		let fallbackId = 0;

		const start = () => {
			if (observer) return;
			window.clearInterval(pollId);
			window.clearTimeout(fallbackId);

			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const el = entry.target as HTMLElement;

						if (entry.isIntersecting) {
							el.classList.add("is-visible");

							if (el.dataset.once === "true") {
								const delay =
									Number.parseFloat(el.dataset.delay ?? "0") * 1000;
								window.setTimeout(() => {
									el.classList.remove("reveal", "reveal-scale", "is-visible");
									el.removeAttribute("data-reveal");
								}, delay + 700);
								io.unobserve(el);
							}
						} else if (el.dataset.once !== "true") {
							el.classList.remove("is-visible");
						}
					});
				},
				{ threshold: 0.2 },
			);

			observer = io;
			elements.forEach((el) => io.observe(el));
		};

		// The boot screen is a fixed full-screen overlay; wait for
		// it to unmount (with a hard fallback) before observing.
		if (document.querySelector("div.fixed.inset-0.z-100")) {
			pollId = window.setInterval(() => {
				if (!document.querySelector("div.fixed.inset-0.z-100")) start();
			}, 150);
			fallbackId = window.setTimeout(start, 4000);
		} else {
			start();
		}

		return () => {
			window.clearInterval(pollId);
			window.clearTimeout(fallbackId);
			observer?.disconnect();
		};
	}, []);

	return null;
};

export default RevealObserver;
