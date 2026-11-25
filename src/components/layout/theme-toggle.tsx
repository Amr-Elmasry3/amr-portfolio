"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const emptySubscribe = () => () => {};

const ThemeToggle = () => {
	const { setTheme, theme } = useTheme();
	const t1 = useTranslations("Header.mode");

	// True only after hydration, without a setState-in-effect.
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	const changeTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";

		setTheme(newTheme);
	};

	// Prevent hydration mismatch
	if (!mounted) return null;

	return (
		<button
			type="button"
			aria-label={
				theme === "light" ? "Switch to dark mode" : "Switch to light mode"
			}
			className={`${theme === "light" ? "flex-row" : "flex-row-reverse"} flex items-center justify-between gap-1 bg-primary-light p-0.5 rounded-[20px] border border-solid border-primary-border shadow-xs cursor-pointer my-transition`}
			onClick={changeTheme}>
			<span className="hidden sm:inline text-[10px] font-bold text-text-description uppercase px-2 my-transition">
				{theme === "light"
					? t1.rich("light", {
							highlight: (chunks) => (
								<span className="hidden xs:inline">{chunks}</span>
							),
						})
					: t1.rich("dark", {
							highlight: (chunks) => (
								<span className="hidden xs:inline">{chunks}</span>
							),
						})}
			</span>

			<span className="text-[18px] text-primary-active bg-surface-secondary h-8 w-8 rounded-full flex items-center justify-center shadow-sm my-transition">
				{theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
			</span>
		</button>
	);
};

export default ThemeToggle;
