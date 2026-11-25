import Image from "next/image";

import AccentSwitch from "@/components/shared/accent-switch";
import SwitchLanguage from "./switch-language";
import ThemeToggle from "./theme-toggle";

const Header = () => {
	return (
		<header className="flex items-center justify-between gap-2 py-3.5 mb-10">
			{/* Logo */}
			<div>
				<Image
					src="/assets/logo.png"
					alt="logo"
					width={70}
					height={30}
					priority
				/>
			</div>

			{/* Settings */}
			<div className="settings flex items-center gap-2">
				{/* Switch Language */}
				<SwitchLanguage />

				{/* Accent Colors */}
				<AccentSwitch />

				{/* Switch Mode */}
				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
