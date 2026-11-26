import { useTranslations } from "next-intl";
import Link from "next/link";

import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { contactInfo } from "@/constants/contact-info";
import { icons } from "@/constants/icons";

// Left column of the contact section: the availability status
// box and the contact channel tiles (email, phone, LinkedIn,
// GitHub).
const ContactInfo = () => {
	const t = useTranslations("Contact.contactInfo");

	const info = t.raw("info") as Record<string, string>;

	return (
		<div className="w-full lg:w-[35%]">
			<ul className="flex flex-col gap-3">
				<li data-reveal data-delay="0.2" className="reveal">
					<div className="bg-primary-light p-3 border border-solid border-primary-border rounded-sm">
						<span className="flex items-center gap-2 mb-2 text-[15px] font-bold text-text-secondary">
							<span className="w-2 h-2 bg-success rounded-full"></span>
							{t("status")}
						</span>

						<p className="text-caption font-medium text-text-description max-w-[90%] xxs:max-w-[80%]">
							{t("statusDescription")}
						</p>
					</div>
				</li>

				{contactInfo.map((item, index) => (
					<li
						key={item.key}
						data-reveal
						data-delay={0.2 + (index + 1) * 0.1}
						className="reveal"
					>
						<SmallBoxWrapper>
							<div className="flex items-center gap-3">
								<span className="min-w-12 h-12 text-subHeading text-text-secondary flex items-center justify-center border border-solid border-border-strong rounded-sm shadow-sm [&_svg]:w-5 [&_svg]:h-5">
									{icons[item.icon]}
								</span>

								<div className="flex flex-col gap-1">
									<span className="text-caption font-bold text-text-primary">
										{info[item.key]}
									</span>

									<Link
										href={item.link}
										className="text-caption text-text-secondary hover:text-primary-hover text-wrap my-transition"
										target="_blank"
									>
										{item.value}
									</Link>
								</div>
							</div>
						</SmallBoxWrapper>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactInfo;
