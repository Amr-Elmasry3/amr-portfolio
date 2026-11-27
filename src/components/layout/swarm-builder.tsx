"use client";

// ####################### Logic Imports  #######################
// => Ready To Use Hooks
import { useContext, useEffect, useLayoutEffect, useRef } from "react";

// => Contexts
import { BootScreenContext } from "@/contexts/boot-screen-context";

// => Swarm engine (cursors that build the page as you scroll)
import { SWARM_CELEBRATE_EVENT } from "@/lib/swarm/celebrate";
import { createSwarm, type SwarmEngine } from "@/lib/swarm/engine";

/**
 * Arms the swarm while the boot screen is showing and starts building
 * the page the moment the boot screen is done.
 */
function SwarmBuilder() {
	// ####################### Inside Component  #######################
	// => Contexts
	const { showBootScreen } = useContext(BootScreenContext);

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

	// Celebration requests (e.g. the contact form was sent).
	useEffect(() => {
		const onCelebrate = (e: Event) => {
			const el = (e as CustomEvent).detail as Element | undefined;
			if (el) engineRef.current?.celebrate(el);
		};
		window.addEventListener(SWARM_CELEBRATE_EVENT, onCelebrate);
		return () =>
			window.removeEventListener(SWARM_CELEBRATE_EVENT, onCelebrate);
	}, []);

	return null;
}

export default SwarmBuilder;
