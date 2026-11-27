"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Small copy-to-clipboard button for the email tile: copies
// the address and flips to a check for two seconds.
interface CopyButtonProps {
	value: string;
	copyLabel: string;
	copiedLabel: string;
}

const CopyButton = ({ value, copyLabel, copiedLabel }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);
	const timer = useRef(0);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			return;
		}
		setCopied(true);
		timer.current = window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="ms-auto flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xs border border-solid border-border-strong px-2 py-1.5 text-smallCaption font-bold text-text-secondary my-transition hover:border-primary-border hover:text-primary-active"
		>
			{copied ? (
				<Check className="size-3.5 text-success" />
			) : (
				<Copy className="size-3.5" />
			)}
			{copied ? copiedLabel : copyLabel}
		</button>
	);
};

export default CopyButton;
