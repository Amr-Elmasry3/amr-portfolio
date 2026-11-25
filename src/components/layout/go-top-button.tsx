"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const GoTopButton = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const handleVisible = () => {
			if (window.pageYOffset > 150) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", handleVisible);
		return () => removeEventListener("scroll", handleVisible);
	}, []);

	return (
		<div
			className={`fixed z-70 left-0 bottom-16 sm:bottom-4 ${isVisible ? "translate-y-0" : "translate-y-20"} p-2.5 sm:p-4 w-full flex justify-end my-transition`}>
			<button
				type="button"
				aria-label="Scroll to top"
				className="flex items-center justify-center bg-primary-light hover:bg-primary-hover text-primary hover:text-white p-2 border-2 border-solid border-primary-border hover:border-transparent rounded-xs shadow-md cursor-pointer my-transition"
				onClick={scrollToTop}>
				<ArrowUp className="text-[18px]" size={18} />
			</button>
		</div>
	);
};

export default GoTopButton;
