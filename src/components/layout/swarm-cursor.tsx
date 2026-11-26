// Swarm cursor: three labeled design-tool cursors (A, B, C)
// that float gently around a shared anchor point over the
// whole page — the site's one signature animation, ported from
// amr's experiment in the previous version. There it ran on
// framer-motion keyframes; here each cursor's float path is a
// CSS keyframe loop with the same offsets and durations.
// Fixed and pointer-transparent, above everything including
// the boot screen, and only on large screens.
const CURSOR_CONFIG = [
	{ color: "#8B5CF6", size: 24, label: "A" },
	{ color: "#EC4899", size: 20, label: "B" },
	{ color: "#06B6D4", size: 28, label: "C" },
] as const;

const SwarmCursor = () => {
	return (
		<div
			aria-hidden="true"
			className="fixed pointer-events-none z-9998 hidden lg:block"
			style={{ left: 400, top: 200 }}
		>
			{CURSOR_CONFIG.map((config, index) => (
				<div key={config.label} className="absolute">
					<div
						className={`swarm-float-${index}`}
						style={{ width: config.size, height: config.size }}
					>
						{/* Cursor arrow */}
						<svg
							width={config.size}
							height={config.size}
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M5.5 3.5L12 14.5L9 14.5L11.5 20.5L8.5 20.5L6 14.5L3 14.5L5.5 3.5Z"
								fill={config.color}
							/>
						</svg>

						{/* Cursor label */}
						<div
							className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold"
							style={{ color: config.color }}
						>
							{config.label}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SwarmCursor;
