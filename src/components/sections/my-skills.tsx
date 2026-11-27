import { useTranslations } from "next-intl";

import SkillGroup from "@/components/sections/skill-group";
import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { mySkills, skillCategories, skillsIcon } from "@/constants/skills";

// The skills, grouped into titled categories (core, state and
// data, forms, UI, tools) — every group visible at once so the
// whole stack can be scanned in one pass. The icon span carries
// the primary text color so the monochrome marks (currentColor)
// stay visible in both themes.
const MySkills = () => {
	const t = useTranslations("Skills");

	return (
		<div className="flex flex-col gap-8">
			{skillCategories.map((category) => {
				const skills = mySkills.filter(
					(skill) => skill.category === category,
				);

				return (
					<SkillGroup
						key={category}
						title={t(`categories.${category}`)}
						count={skills.length}
					>
						<ul className="skills-content grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
							{skills.map((skill) => (
								<li
									key={skill.id}
									className="hover:-translate-y-1 my-transition"
								>
									<SmallBoxWrapper>
										<div className="flex flex-col items-center gap-3">
											<span className="w-7 text-text-primary">
												{skillsIcon[skill.icon]}
											</span>

											<span className="text-caption font-bold text-text-secondary">
												{skill.skill}
											</span>
										</div>
									</SmallBoxWrapper>
								</li>
							))}
						</ul>
					</SkillGroup>
				);
			})}
		</div>
	);
};

export default MySkills;
