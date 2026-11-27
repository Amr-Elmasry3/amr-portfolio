import type { ReactNode } from "react";

// Small gradient box used for stat cards and similar tiles.
interface SmallBoxWrapperProps {
	children: ReactNode;
}

const SmallBoxWrapper = ({ children }: SmallBoxWrapperProps) => {
	return (
		<div className="small-box-wrapper bg-linear-to-br from-surface-secondary/30 via-primary-lighter to-surface-secondary/30 hover:bg-surface-active rounded-sm px-3 py-4 border border-solid border-border-strong hover:border-primary-border shadow-sm my-transition">
			{children}
		</div>
	);
};

export default SmallBoxWrapper;
