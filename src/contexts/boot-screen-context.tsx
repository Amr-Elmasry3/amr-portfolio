"use client";

import { createContext, useState } from "react";

interface BootScreenContextValue {
	showBootScreen: boolean;
	handleBootScreen: () => void;
}

export const BootScreenContext = createContext<BootScreenContextValue>({
	showBootScreen: true,
	handleBootScreen: () => {},
});

const BootScreenProvider = ({ children }: { children: React.ReactNode }) => {
	const [showBootScreen, setShowBootScreen] = useState<boolean>(true);

	const handleBootScreen = (): void => {
		setShowBootScreen((previous) => !previous);
	};

	return (
		<BootScreenContext
			value={{
				showBootScreen: showBootScreen,
				handleBootScreen: handleBootScreen,
			}}>
			{children}
		</BootScreenContext>
	);
};

export default BootScreenProvider;
