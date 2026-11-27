// Ask the swarm to send a cursor over and celebrate an element
// (used when the contact form is sent successfully). The
// SwarmBuilder listens for the event and hands it to the engine,
// so callers never touch the engine directly.
export const SWARM_CELEBRATE_EVENT = "swarm:celebrate";

export const celebrateWithSwarm = (el: Element | null) => {
	if (!el) return;
	window.dispatchEvent(
		new CustomEvent(SWARM_CELEBRATE_EVENT, { detail: el }),
	);
};
