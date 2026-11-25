"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useContext } from "react";

import {
	heroHeaderContainer,
	heroLanguageSwitcher,
	heroLogo,
	heroSettings,
	heroThemeToggle,
} from "@/animations/hero";
import AccentSwitch from "@/components/shared/accent-switch";
import { BootScreenContext } from "@/contexts/boot-screen-context";
import SwitchLanguage from "./switch-language";
import ThemeToggle from "./theme-toggle";

const Header = () => {
	const { showBootScreen } = useContext(BootScreenContext);

	return (
		<motion.header
			className="flex items-center justify-between gap-2 py-3.5 mb-10"
			variants={heroHeaderContainer}
			initial="hidden"
			animate={showBootScreen ? "hidden" : "visible"}>
			{/* Logo */}
			<motion.div variants={heroLogo}>
				<Image
					src="/assets/logo.png"
					alt="logo"
					width={70}
					height={30}
					priority
				/>
			</motion.div>

			{/* Settings */}
			<motion.div
				className="settings flex items-center gap-2"
				variants={heroSettings}>
				{/* Switch Language */}
				<motion.div variants={heroLanguageSwitcher}>
					<SwitchLanguage />
				</motion.div>

				{/* Accent Colors */}
				<motion.div variants={heroThemeToggle}>
					<AccentSwitch />
				</motion.div>

				{/* Switch Mode */}
				<motion.div variants={heroThemeToggle}>
					<ThemeToggle />
				</motion.div>
			</motion.div>
		</motion.header>
	);
};

export default Header;
