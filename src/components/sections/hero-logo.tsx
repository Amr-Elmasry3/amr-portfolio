// The AE brand mark behind the hero photo, redrawn as SVG so
// its gradient follows the active accent color (the version
// baked into the original photo was fixed blue). Geometry is
// traced from the original artwork on the photo's 1299x941
// canvas, so it lines up with the separated cutout image.
const DOTS: { x: number; y: number; r: number }[] = [
	{ x: 238, y: 730, r: 9 },
	{ x: 1188, y: 298, r: 8 },
].flatMap(({ x, y, r }) =>
	Array.from({ length: 12 }, (_, i) => ({
		x: x + (i % 4) * (r === 9 ? 36 : 34),
		y: y + Math.floor(i / 4) * (r === 9 ? 36 : 34),
		r,
	})),
);

const HeroLogo = () => {
	return (
		<svg
			viewBox="0 0 1299 941"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden="true"
			className="absolute inset-0 h-full w-full"
		>
			<defs>
				<linearGradient
					id="hero-logo-gradient"
					gradientUnits="userSpaceOnUse"
					x1="120"
					y1="941"
					x2="1180"
					y2="0"
				>
					<stop offset="0" style={{ stopColor: "var(--primary)" }} />
					<stop
						offset="0.55"
						style={{
							stopColor: "color-mix(in srgb, var(--primary) 70%, white)",
						}}
					/>
					<stop
						offset="1"
						style={{
							stopColor: "color-mix(in srgb, var(--primary) 40%, white)",
						}}
					/>
				</linearGradient>
			</defs>

			<g fill="url(#hero-logo-gradient)">
				{/* E bars */}
				<polygon points="795,250 1255,250 1217,314 795,314" />
				<polygon points="950,370 1275,370 1237,432 950,432" />
				<polygon points="1042,486 1290,486 1252,548 1042,548" />

				{/* Dot grids */}
				{DOTS.map((dot, i) => (
					<circle key={i} cx={dot.x} cy={dot.y} r={dot.r} />
				))}
			</g>

			<g
				fill="none"
				stroke="url(#hero-logo-gradient)"
				strokeLinejoin="miter"
				strokeLinecap="butt"
			>
				{/* A */}
				<path d="M150 762 L578 192 L768 566" strokeWidth="124" />

				{/* </> mark */}
				<polyline points="352,606 292,656 352,706" strokeWidth="25" />
				<line x1="392" y1="596" x2="344" y2="716" strokeWidth="23" />
				<polyline points="424,606 484,656 424,706" strokeWidth="25" />

				{/* Speed slashes */}
				<line x1="1085" y1="195" x2="1275" y2="8" strokeWidth="13" />
				<line x1="1140" y1="225" x2="1295" y2="85" strokeWidth="13" />
				<line x1="8" y1="668" x2="315" y2="398" strokeWidth="12" />
			</g>
		</svg>
	);
};

export default HeroLogo;
