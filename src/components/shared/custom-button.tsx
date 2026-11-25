import { BeatLoader } from "react-spinners";
import type { ReactNode } from "react";

// Shared button used across sections, with an optional icon and
// a loading state (used by the contact form). Ported from the
// previous version of the site.
type StyleOption = "primary" | "primaryTrans";

const btnStyles: Record<StyleOption, string> = {
	primaryTrans:
		"bg-transparent hover:bg-primary-hover text-primary hover:text-white border hover:border-transparent border-solid border-primary",
	primary: "bg-primary-active hover:bg-primary-hover text-white border-none",
};

export interface CustomButtonProps {
	type: "submit" | "reset" | "button";
	btnTitle: string;
	children?: ReactNode;
	btnStyle: StyleOption;
	handleClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
}

const CustomButton = ({
	type,
	btnTitle,
	children,
	btnStyle,
	handleClick,
	disabled,
	loading = false,
}: CustomButtonProps) => {
	return (
		<button
			className={`w-full h-full min-h-9.25 text-[13px] xxs:text-caption font-medium ${children || loading ? "flex items-center justify-center gap-3" : ""} py-2 px-4 rounded-xs cursor-pointer my-transition ${btnStyles[btnStyle]}`}
			type={type}
			onClick={handleClick}
			disabled={disabled || loading}
			aria-busy={loading}
		>
			{loading && <BeatLoader size={12} color="#ffffff" />}

			<span>{btnTitle}</span>

			{children && (
				<span className="text-button [&_svg]:w-4 [&_svg]:h-4">{children}</span>
			)}
		</button>
	);
};

export default CustomButton;
