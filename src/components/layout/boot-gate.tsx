"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useContext } from "react";

import { BootScreenContext } from "@/contexts/boot-screen-context";
import BootScreen from "./boot-screen";

const BootGate = ({ children }: { children: React.ReactNode }) => {
	const { showBootScreen, handleBootScreen } = useContext(BootScreenContext);

	const completeBoot = useCallback(
		() => handleBootScreen(),
		[handleBootScreen],
	);

	return (
		<>
			<AnimatePresence mode="wait">
				{showBootScreen && <BootScreen onComplete={completeBoot} />}
			</AnimatePresence>

			{children}
		</>
	);
};

export default BootGate;
