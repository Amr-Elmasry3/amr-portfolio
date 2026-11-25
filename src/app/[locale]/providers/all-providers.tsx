"use client";

// [1] Setup Next Theme Provider
import { ThemeProvider } from "./theme-provider";

// [2] Setup Accent Color Provider
import { AccentProvider } from "./accent-provider";

// [3] Setup Boot Screen Provider
import BootScreenProvider from "@/contexts/boot-screen-context";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}>
			<AccentProvider>
				<BootScreenProvider>{children}</BootScreenProvider>
			</AccentProvider>
		</ThemeProvider>
	);
};

export default AllProviders;
