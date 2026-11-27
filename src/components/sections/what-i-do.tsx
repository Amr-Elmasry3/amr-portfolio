import { useTranslations } from "next-intl";

import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { icons } from "@/constants/icons";

// "What I do" strip under the bio and numbers: three tiles
// naming the work directly — responsive apps, modern builds,
// performance and user experience.
interface Service {
	icon: string;
	title: string;
	description: string;
}

const WhatIDo = () => {
	const t = useTranslations("About");

	const services = t.raw("services") as Service[];

	return (
		<ul className="mt-10 grid gap-4 sm:grid-cols-3">
			{services.map((service) => (
				<li
					key={service.title}
					className="my-transition hover:-translate-y-1">
					<SmallBoxWrapper>
						<div className="flex flex-col gap-3">
							<span className="flex size-11 items-center justify-center rounded-full bg-primary-light text-primary [&_svg]:w-[22px] [&_svg]:h-[22px]">
								{icons[service.icon]}
							</span>

							<span className="text-caption font-bold text-text-primary line-clamp-1">
								{service.title}
							</span>

							<span className="text-smallCaption font-medium text-text-description leading-4! line-clamp-2">
								{service.description}
							</span>
						</div>
					</SmallBoxWrapper>
				</li>
			))}
		</ul>
	);
};

export default WhatIDo;
