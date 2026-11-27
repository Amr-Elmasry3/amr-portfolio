import type { CSSProperties } from "react";

// Decorations around the hero photo that the swarm draws in:
// dotted grid, a traced ring, the </> code mark and accent slashes.
// Each shape is a swarm "draw" target inside the data-swarm-draw
// host; amr's swarm.css turns the engine's --swarm-draw progress
// into ink (hero-draw-stroke traces, hero-dot pops dots in one by
// one, hero-draw-fill grows a filled circle).
const HeroDecorations = () => {
	const dots = Array.from({ length: 20 }, (_, i) => ({
		cx: 1096 + (i % 5) * 36,
		cy: 56 + Math.floor(i / 5) * 36,
		delay: ((i % 5) + Math.floor(i / 5)) * 0.06,
	}));

	return (
		<svg
			data-swarm-draw
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
			viewBox="0 0 1299 941"
			fill="none"
		>
			{/* Traced ring, top left */}
			<circle
				cx="112"
				cy="118"
				r="62"
				pathLength={1}
				strokeDasharray={1}
				className="hero-draw-stroke"
				stroke="var(--primary)"
				strokeWidth="5"
				opacity="0.7"
			/>
			<circle
				cx="112"
				cy="118"
				r="13"
				className="hero-draw-fill"
				fill="var(--primary)"
				opacity="0.7"
			/>

			{/* Dotted grid, top right */}
			{dots.map((dot) => (
				<circle
					key={`${dot.cx}-${dot.cy}`}
					cx={dot.cx}
					cy={dot.cy}
					r="7"
					className="hero-dot"
					fill="var(--primary)"
					opacity="0.55"
					style={{ "--dot-delay": dot.delay } as CSSProperties}
				/>
			))}

			{/* Code mark </>, bottom left */}
			<g
				stroke="var(--primary)"
				strokeWidth="17"
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity="0.85"
			>
				<path
					d="M 96 742 L 52 786 L 96 830"
					pathLength={1}
					strokeDasharray={1}
					className="hero-draw-stroke"
				/>
				<path
					d="M 168 730 L 128 842"
					pathLength={1}
					strokeDasharray={1}
					className="hero-draw-stroke"
				/>
				<path
					d="M 204 742 L 248 786 L 204 830"
					pathLength={1}
					strokeDasharray={1}
					className="hero-draw-stroke"
				/>
			</g>

			{/* Accent slashes, bottom right */}
			<g
				stroke="var(--primary)"
				strokeWidth="9"
				strokeLinecap="round"
				opacity="0.6"
			>
				<line
					x1="1132"
					y1="852"
					x2="1196"
					y2="772"
					pathLength={1}
					strokeDasharray={1}
					className="hero-draw-stroke"
				/>
				<line
					x1="1204"
					y1="852"
					x2="1268"
					y2="772"
					pathLength={1}
					strokeDasharray={1}
					className="hero-draw-stroke"
				/>
			</g>
		</svg>
	);
};

export default HeroDecorations;
