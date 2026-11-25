const PageBackground = () => {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-background" />

			{/* Soft accent wash spread over the whole page */}
			<div className="page-background-wash absolute inset-0" />

			{/* Faint grid that fades out towards the bottom */}
			<div className="page-background-grid absolute inset-0" />
		</div>
	);
};

export default PageBackground;
