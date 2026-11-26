import SmallBoxWrapper from "@/components/shared/small-box-wrapper";
import { mySkills, skillsIcon } from "@/constants/skills";

// Grid of skill tiles (brand icon + name). The icon span
// carries the primary text color so the monochrome marks
// (currentColor) stay visible in both themes.
const MySkills = () => {
	return (
		<ul className="skills-content grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
			{mySkills.map((skill, index) => (
				<li
					key={skill.id}
					data-reveal
					data-once="true"
					data-delay={0.2 + index * 0.05}
					className="reveal hover:-translate-y-1 my-transition"
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
	);
};

export default MySkills;
