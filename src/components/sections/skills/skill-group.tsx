"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

// One skill category: a heading row that can fold the group
// away, for visitors who want the section shorter. Groups
// start open — folding is an option, never the default — and
// a group folded before the swarm reaches it simply appears
// unfolded-style when reopened.
interface SkillGroupProps {
	title: string;
	count: number;
	children: ReactNode;
}

const SkillGroup = ({ title, count, children }: SkillGroupProps) => {
	const [open, setOpen] = useState(true);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<button
					type="button"
					aria-expanded={open}
					onClick={() => setOpen((value) => !value)}
					className="flex cursor-pointer items-center gap-3"
				>
					<span className="text-button font-bold text-text-primary">
						{title}
					</span>

					<span className="text-smallCaption font-bold text-text-description">
						{count}
					</span>

					<ChevronDown
						className={`size-4 text-text-description my-transition ${open ? "" : "-rotate-90"}`}
					/>
				</button>

				<span aria-hidden="true" className="h-px flex-1 bg-border"></span>
			</div>

			{open && children}
		</div>
	);
};

export default SkillGroup;
