import type { ReactNode } from "react";

// Small gradient box used for stat cards and similar tiles.
// The highlighted variant washes the tile in the accent so one
// special card (the passion stat) stands out from the rest.
interface SmallBoxWrapperProps {
	children: ReactNode;
	highlighted?: boolean;
}

const SmallBoxWrapper = ({ children, highlighted }: SmallBoxWrapperProps) => {
	return (
		<div
			className={`small-box-wrapper bg-linear-to-br rounded-sm px-3 py-4 border border-solid my-transition ${
				highlighted
					? "from-primary/30 via-primary-lighter to-primary/30 border-primary-border shadow-md"
					: "from-surface-secondary/30 via-primary-lighter to-surface-secondary/30 hover:bg-surface-active border-border-strong hover:border-primary-border shadow-sm"
			}`}
		>
			{children}
		</div>
	);
};

export default SmallBoxWrapper;
