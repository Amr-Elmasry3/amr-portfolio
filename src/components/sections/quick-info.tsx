import Link from "next/link";
import { useTranslations } from "next-intl";

import { icons } from "@/constants/icons";
import { SITE_CONFIG } from "@/constants/site-config.constants";

// A compact fact row under the bio — location, email and
// availability — for visitors scanning for the essentials
// instead of reading the paragraphs.
const QuickInfo = () => {
	const t = useTranslations("HomePage");

	return (
		<div className="flex flex-wrap items-center gap-x-5 gap-y-2">
			<span className="flex items-center gap-1.5 text-caption font-medium text-text-secondary">
				<span className="text-primary [&_svg]:w-4 [&_svg]:h-4">
					{icons["location"]}
				</span>
				{t("location")}
			</span>

			<Link
				href={`mailto:${SITE_CONFIG.email}`}
				className="flex items-center gap-1.5 text-caption font-medium text-text-secondary my-transition hover:text-primary-active"
			>
				<span className="text-primary [&_svg]:w-4 [&_svg]:h-4">
					{icons["envelope"]}
				</span>
				{SITE_CONFIG.email}
			</Link>

			<span className="flex items-center gap-1.5 text-caption font-medium text-text-secondary">
				<span className="w-2 h-2 rounded-full bg-success"></span>
				{t("status")}
			</span>
		</div>
	);
};

export default QuickInfo;
