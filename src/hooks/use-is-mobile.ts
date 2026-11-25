"use client";

import { useCallback, useSyncExternalStore } from "react";

export const useIsMobile = (breakpoint = 767) => {
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
			mql.addEventListener("change", onStoreChange);
			return () => mql.removeEventListener("change", onStoreChange);
		},
		[breakpoint],
	);

	const getSnapshot = useCallback(
		() => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
		[breakpoint],
	);

	const getServerSnapshot = useCallback(() => false, []);

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
