"use client";

// [1] Setup Next Theme Provider
import { ThemeProvider } from "./theme-provider";

// [2] Setup Accent Color Provider
import { AccentProvider } from "./accent-provider";

function AllProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}>
			<AccentProvider>{children}</AccentProvider>
		</ThemeProvider>
	);
}

export default AllProviders;
