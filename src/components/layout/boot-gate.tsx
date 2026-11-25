"use client";

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
			{showBootScreen && <BootScreen onComplete={completeBoot} />}

			{children}
		</>
	);
};

export default BootGate;
