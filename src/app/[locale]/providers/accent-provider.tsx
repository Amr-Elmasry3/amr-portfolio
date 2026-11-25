"use client";

import * as React from "react";

import {
	ACCENT_STORAGE_KEY,
	DEFAULT_ACCENT,
	isAccentName,
	type AccentName,
} from "@/constants/accents.constants";

interface AccentContextValue {
	accent: AccentName;
	setAccent: (accent: AccentName) => void;
}

const AccentContext = React.createContext<AccentContextValue>({
	accent: DEFAULT_ACCENT,
	setAccent: () => {},
});

// The active accent lives outside React, on the <html> element itself
// (data-accent attribute) mirrored in localStorage, so it is kept in
// sync through useSyncExternalStore.
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

const getSnapshot = (): AccentName => {
	const current = document.documentElement.getAttribute("data-accent");
	return isAccentName(current) ? current : DEFAULT_ACCENT;
};

const getServerSnapshot = (): AccentName => DEFAULT_ACCENT;

const applyAccent = (accent: AccentName) => {
	const root = document.documentElement;

	if (accent === DEFAULT_ACCENT) {
		root.removeAttribute("data-accent");
		localStorage.removeItem(ACCENT_STORAGE_KEY);
	} else {
		root.setAttribute("data-accent", accent);
		localStorage.setItem(ACCENT_STORAGE_KEY, accent);
	}

	listeners.forEach((listener) => listener());
};

export const AccentProvider = ({ children }: { children: React.ReactNode }) => {
	const accent = React.useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	// Restore the saved accent once, on mount.
	React.useEffect(() => {
		const stored = localStorage.getItem(ACCENT_STORAGE_KEY);

		if (isAccentName(stored) && stored !== getSnapshot()) {
			applyAccent(stored);
		}
	}, []);

	const setAccent = React.useCallback((next: AccentName) => {
		applyAccent(next);
	}, []);

	const value = React.useMemo(
		() => ({ accent, setAccent }),
		[accent, setAccent],
	);

	return (
		<AccentContext.Provider value={value}>{children}</AccentContext.Provider>
	);
};

export const useAccent = () => React.useContext(AccentContext);
