const PageBackground = () => {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-background" />

			{/* Two-Tone Ambient Glow */}
			<div
				className="
          absolute
          -right-40
          -top-40
          h-125
          w-125
          rounded-full
          bg-primary/5
          blur-[120px]
          dark:bg-primary/10
        "
			/>

			<div
				className="
          absolute
          -bottom-40
          -left-40
          h-100
          w-100
          rounded-full
          bg-primary/3
          blur-[100px]
          dark:bg-primary/6
        "
			/>

			{/* Subtle Edge Gradient */}
			<div
				className="
          absolute
          inset-0
          bg-linear-to-tr
          from-primary/5
          via-transparent
          to-primary/5
          dark:from-primary/8
          dark:to-primary/8
        "
			/>
		</div>
	);
};

export default PageBackground;
