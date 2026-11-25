// Runs a DOM update inside a view transition so color changes
// (theme and accent switches) sweep in from the side of the
// screen instead of snapping instantly (see the ::view-transition
// rules in base.css). Falls back to a plain update when the API
// is unavailable or the user prefers reduced motion. The origin
// is kept for possible future use.
interface TransitionOrigin {
	x: number;
	y: number;
}

type ViewTransitionDocument = Document & {
	startViewTransition?: (update: () => void) => unknown;
};

export const withViewTransition = (
	update: () => void,
	origin?: TransitionOrigin,
) => {
	const doc = document as ViewTransitionDocument;

	if (
		!doc.startViewTransition ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		update();
		return;
	}

	if (origin) {
		document.documentElement.style.setProperty("--vt-x", `${origin.x}px`);
		document.documentElement.style.setProperty("--vt-y", `${origin.y}px`);
	}

	doc.startViewTransition(() => {
		update();
	});
};
