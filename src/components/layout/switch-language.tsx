"use client";

import { ChevronDown } from "lucide-react";
import EG from "country-flag-icons/react/3x2/EG";
import US from "country-flag-icons/react/3x2/US";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const flagFor = (loc: string) => {
	if (loc === "en") return <US className="w-4.5 h-auto shrink-0" />;
	if (loc === "ar") return <EG className="w-4.5 h-auto shrink-0" />;
	return null;
};

const SwitchLanguageInner = () => {
	const router = useRouter();
	const pathname = usePathname() || "/";
	const searchParams = useSearchParams();
	const currentLocale = useLocale();
	const t1 = useTranslations("Header");

	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	const changeLocale = useCallback(
		(locale: string) => {
			const query = searchParams?.toString();
			const newPath = `${pathname}${query ? `?${query}` : ""}`;

			router.push(newPath, { locale });
			setOpen(false);
		},
		[pathname, searchParams, router],
	);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (!ref.current) return;
			if (!ref.current.contains(e.target as Node)) setOpen(false);
		};

		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, []);

	const languages = t1.raw("language") as Record<string, string>;
	const isArabic = currentLocale === "ar";

	return (
		<div ref={ref} className="relative inline-block text-left">
			<button
				type="button"
				aria-label="Change language"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 min-h-9.5 h-full px-3 py-1 rounded-md border border-solid border-border-strong bg-surface-secondary shadow-xs cursor-pointer">
				<span className="flex items-center gap-2">
					{flagFor(currentLocale)}

					<span className="hidden sm:inline text-caption font-bold text-text-secondary">
						{languages[currentLocale]}
					</span>
				</span>

				<ChevronDown
					className="hidden sm:block text-button text-text-secondary"
					size={16}
				/>
			</button>

			{open && (
				<ul
					className={`absolute ${isArabic ? "left-0" : "right-0"} mt-2 w-32 divide-y divide-border border border-solid border-border-strong bg-surface-secondary rounded-md shadow-sm z-50 overflow-hidden my-transition`}
					role="menu">
					{routing.locales.map((loc) => (
						<li key={loc} role="none">
							<button
								type="button"
								role="menuitem"
								aria-label={languages[loc]}
								onClick={() => changeLocale(loc)}
								className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-surface cursor-pointer my-transition">
								{flagFor(loc)}

								<span className="text-caption font-medium text-text-secondary">
									{languages[loc]}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

// Static lookalike shown while the interactive switch resolves
// (useSearchParams inside needs a Suspense boundary in the layout).
const SwitchLanguageFallback = () => {
	const currentLocale = useLocale();
	const t1 = useTranslations("Header");
	const languages = t1.raw("language") as Record<string, string>;

	return (
		<div className="relative inline-block text-left">
			<button
				type="button"
				aria-label="Change language"
				className="flex items-center gap-2 min-h-9.5 h-full px-3 py-1 rounded-md border border-solid border-border-strong bg-surface-secondary shadow-xs">
				<span className="flex items-center gap-2">
					{flagFor(currentLocale)}

					<span className="hidden sm:inline text-caption font-bold text-text-secondary">
						{languages[currentLocale]}
					</span>
				</span>
			</button>
		</div>
	);
};

const SwitchLanguage = () => {
	return (
		<Suspense fallback={<SwitchLanguageFallback />}>
			<SwitchLanguageInner />
		</Suspense>
	);
};

export default SwitchLanguage;
