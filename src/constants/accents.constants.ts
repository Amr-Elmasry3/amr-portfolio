// Accent color themes. The default accent (blue) is baked into the
// :root / .dark tokens (tokens.css / dark.css); other accents override
// the brand tokens through a data-accent attribute on <html>.
export const ACCENTS = [
	{ name: "blue", swatch: "#2563eb" },
	{ name: "violet", swatch: "#7c3aed" },
	{ name: "amber", swatch: "#d97706" },
	{ name: "emerald", swatch: "#059669" },
	{ name: "rose", swatch: "#e11d48" },
	{ name: "cyan", swatch: "#0891b2" },
] as const;

export type AccentName = (typeof ACCENTS)[number]["name"];

export const DEFAULT_ACCENT: AccentName = "blue";

export const ACCENT_STORAGE_KEY = "accent-color";

export const isAccentName = (value: string | null): value is AccentName =>
	ACCENTS.some((accent) => accent.name === value);
