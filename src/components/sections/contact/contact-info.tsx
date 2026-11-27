import { useTranslations } from "next-intl";
import Link from "next/link";

import CopyButton from "@/components/sections/contact/copy-button";
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
				<li>
					<div className="bg-primary-light p-3 border border-solid border-primary-border rounded-sm">
						<span className="flex items-center gap-2 mb-2 text-[15px] font-bold text-text-secondary">
							<span className="relative flex w-2 h-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none"></span>
								<span className="relative inline-flex w-2 h-2 bg-success rounded-full"></span>
							</span>
							{t("status")}
						</span>

						<p className="text-caption font-medium text-text-description max-w-[90%] xxs:max-w-[80%]">
							{t("statusDescription")}
						</p>
					</div>
				</li>

				{contactInfo.map((item) => (
					<li key={item.key}>
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

								{item.key === "email" && (
									<CopyButton
										value={item.value}
										copyLabel={t("copy")}
										copiedLabel={t("copied")}
									/>
								)}
							</div>
						</SmallBoxWrapper>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactInfo;
