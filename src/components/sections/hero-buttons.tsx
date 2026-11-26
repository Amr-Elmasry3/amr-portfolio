import Link from "next/link";
import { useTranslations } from "next-intl";

import CustomButton from "@/components/shared/custom-button";
import { icons } from "@/constants/icons";

// Hero call-to-action buttons: view projects and download the CV.
const HeroButtons = () => {
	const t = useTranslations("Buttons");

	return (
		<div className="hero-links flex items-stretch justify-center md:justify-start gap-4 mt-5 mb-6">
			<Link href="#projects" data-reveal data-once="true" data-delay="0.7" className="reveal flex">
				<CustomButton type="button" btnTitle={t("projects")} btnStyle="primary">
					{icons["rightArrowCircle"]}
				</CustomButton>
			</Link>

			<Link href="/Amr-Elmasry-Resume.pdf" target="_blank" data-reveal data-once="true" data-delay="0.8" className="reveal flex">
				<CustomButton
					type="button"
					btnTitle={t("cv")}
					btnStyle="primaryTrans"
				>
					{icons["download"]}
				</CustomButton>
			</Link>
		</div>
	);
};

export default HeroButtons;
