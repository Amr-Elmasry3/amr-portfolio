"use client";

import { useContext, useEffect, useRef } from "react";

import { BootScreenContext } from "@/contexts/boot-screen-context";
import { createSwarm, type SwarmEngine } from "@/lib/swarm";

// Mounts amr's swarm builder and ties it to the boot screen:
// the cursors circle the boot screen while it is up
// (preview), then burst out and build the page block by
// block the moment the boot screen completes (start).
const SwarmBuilder = () => {
	const { showBootScreen } = useContext(BootScreenContext);
	const engineRef = useRef<SwarmEngine | null>(null);
	const startedRef = useRef(false);

	useEffect(() => {
		const engine = createSwarm();
		engineRef.current = engine;
		engine.preview();

		return () => {
			engine.destroy();
			engineRef.current = null;
			startedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (!showBootScreen && !startedRef.current) {
			startedRef.current = true;
			engineRef.current?.start();
		}
	}, [showBootScreen]);

	return null;
};

export default SwarmBuilder;
