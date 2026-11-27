"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { useAccent } from "@/app/[locale]/providers/accent-provider";
import { ACCENTS } from "@/constants/accents.constants";
import { withViewTransition } from "@/lib/view-transition";

// Closed by default to save header space; opens a dropdown
// listing every accent color.
const AccentSwitch = () => {
	const { accent, setAccent } = useAccent();
	const isArabic = useLocale() === "ar";
	const t = useTranslations("Accents");

	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (!ref.current) return;
			if (!ref.current.contains(e.target as Node)) setOpen(false);
		};

		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, []);

	const activeAccent = ACCENTS.find((item) => item.name === accent);

	return (
		<div ref={ref} className="relative inline-block text-left">
			<button
				type="button"
				aria-label="Change accent color"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 min-h-9 h-full px-2.5 py-1 rounded-full cursor-pointer my-transition hover:bg-primary-light">
				<Palette className="hidden sm:block text-text-secondary" size={16} />

				<span
					aria-hidden="true"
					className="h-3.5 w-3.5 rounded-full border border-solid border-black/10"
					style={{ backgroundColor: activeAccent?.swatch }}
				/>

				<ChevronDown className="hidden sm:block text-text-secondary" size={16} />
			</button>

			{open && (
				<ul
					className={`absolute ${isArabic ? "left-0" : "right-0"} mt-2 w-40 divide-y divide-border border border-solid border-border-strong bg-surface-secondary rounded-md shadow-sm z-50 overflow-hidden my-transition`}
					role="menu">
					{ACCENTS.map((item) => {
						const isActive = item.name === accent;

						return (
							<li key={item.name} role="none">
								<button
									type="button"
									role="menuitem"
									aria-label={t(item.name)}
									onClick={(e) => {
										withViewTransition(() => setAccent(item.name), {
											x: e.clientX,
											y: e.clientY,
										});
										setOpen(false);
									}}
									className={`w-full text-start flex items-center gap-2 px-3 py-2 cursor-pointer my-transition ${isActive ? "bg-primary-light" : "hover:bg-surface"}`}>
									<span
										aria-hidden="true"
										className="h-3.5 w-3.5 rounded-full border border-solid border-black/10 shrink-0"
										style={{ backgroundColor: item.swatch }}
									/>

									<span className="text-caption font-medium text-text-secondary flex-1">
										{t(item.name)}
									</span>

									{isActive && (
										<Check className="text-primary" size={14} />
									)}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default AccentSwitch;
