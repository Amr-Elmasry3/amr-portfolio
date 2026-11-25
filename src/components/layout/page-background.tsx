const PageBackground = () => {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-background" />

			{/* Accent-tinted ambient glows (follow the active accent color) */}
			<div className="page-background-glows absolute inset-0" />
		</div>
	);
};

export default PageBackground;
