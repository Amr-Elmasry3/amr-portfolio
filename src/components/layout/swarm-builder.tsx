"use client";

// ####################### Logic Imports  #######################
// => Ready To Use Hooks
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";

// => Contexts
import { BootScreenContext } from "@/contexts/boot-screen-context";

// => Swarm engine (cursors that build the page as you scroll)
import { createSwarm, type SwarmEngine } from "@/lib/swarm/engine";

/**
 * Arms the swarm while the boot screen is showing, starts building the page
 * the moment the boot screen is done, and offers a small "replay" button.
 */
function SwarmBuilder() {
	// ####################### Inside Component  #######################
	// => Contexts
	const { showBootScreen, handleBootScreen } = useContext(BootScreenContext);

	// => Hooks
	const t = useTranslations("Swarm");

	// => States & Refs
	const engineRef = useRef<SwarmEngine | null>(null);

	// => Effects
	useLayoutEffect(() => {
		const engine = createSwarm();
		engineRef.current = engine;
		engine.preview(); // cursors appear with the boot screen

		return () => {
			engine.destroy();
			engineRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!showBootScreen) engineRef.current?.start();
	}, [showBootScreen]);

	// Replay = a fresh load: boot screen again, swarm circles the name, then builds.
	const replay = () => {
		window.scrollTo({ top: 0, behavior: "instant" });
		engineRef.current?.replay();
		handleBootScreen();
	};

	if (showBootScreen) return null;

	return (
		<button
			type="button"
			onClick={replay}
			className="fixed bottom-24 sm:bottom-6 end-4 z-90 rounded-full border border-solid border-border-strong bg-surface-secondary px-4 py-2 text-button font-bold text-text-secondary shadow-sm my-transition hover:text-text-primary"
		>
			{t("replay")}
		</button>
	);
}

export default SwarmBuilder;
