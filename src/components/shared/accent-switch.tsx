"use client";

import { Check } from "lucide-react";

import { ACCENTS } from "@/constants/accents.constants";
import { useAccent } from "@/app/[locale]/providers/accent-provider";

const AccentSwitch = () => {
	const { accent, setAccent } = useAccent();

	return (
		<div className="flex items-center gap-2" role="radiogroup" aria-label="Accent color">
			{ACCENTS.map(({ name, label, swatch }) => {
				const isActive = accent === name;

				return (
					<button
						key={name}
						type="button"
						role="radio"
						aria-checked={isActive}
						aria-label={`${label} accent`}
						title={label}
						onClick={() => setAccent(name)}
						style={{ backgroundColor: swatch }}
						className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${
							isActive
								? "ring-2 ring-primary ring-offset-2 ring-offset-background"
								: "opacity-70 hover:opacity-100"
						}`}>
						{isActive && <Check size={14} strokeWidth={3} />}
					</button>
				);
			})}
		</div>
	);
};

export default AccentSwitch;
