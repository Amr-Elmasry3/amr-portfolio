"use client";

// [1] Setup Next Theme Provider
import { ThemeProvider } from "./theme-provider";

function AllProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}>
			{children}
		</ThemeProvider>
	);
}

export default AllProviders;
