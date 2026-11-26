/**
 * Swarm builder — an original implementation of the "page builds itself as
 * you scroll" idea. A swarm of cursors flies to each visual block of the page,
 * drags out a selection rectangle (boxes / images / buttons) or types across
 * the text (headings / paragraphs), and the real element is revealed. Shapes
 * inside a `data-swarm-draw` svg are traced one by one, and an image marked
 * `data-swarm-paint` is painted on as its cursor sweeps across it.
 *
 * It never changes content, markup or colours: elements are only held back
 * with an opacity / clip-path / blur rule (see globals.css) until a cursor
 * reveals them, and the cursors are painted with the site's own colour
 * tokens, so light, dark and RTL all work.
 *
 * Safety nets: nothing is hidden when `prefers-reduced-motion` is set, when
 * JS fails, or when printing; anything left hidden in the viewport for too
 * long is force-revealed.
 */

type El = HTMLElement | SVGElement;
type Kind = "box" | "text" | "block" | "draw" | "paint";
type TargetState = "pending" | "building" | "done";
type Phase = "idle" | "fly" | "hold" | "build";
type Role = "lead" | "assist";

interface Target {
	el: El;
	kind: Kind;
	lines: number;
	state: TargetState;
	parent: Target | null;
	inView: boolean;
	forced: boolean;
	viewSince: number;
	releasedAt: number;
	agent: Agent | null;
	assist: Agent | null;
	assisted: boolean;
	progress: number; // eased build progress, shared with the assisting cursor
	typing:
		| {
				clips: number[];
				fx: number[];
				fy: number[];
				edge: number[];
				lineTop: number[];
				lineBottom: number[];
		  }
		| null
		| undefined; // undefined = not prepared yet
}

interface Geo {
	sx: number;
	sy: number;
	ex: number;
	ey: number;
	cx: number;
	cy: number;
}

interface Agent {
	x: number;
	y: number;
	vx: number;
	vy: number;
	alpha: number;
	dying: boolean;
	seed: number;
	phase: Phase;
	role: Role;
	target: Target | null;
	t0: number;
	dur: number;
	rect: DOMRect | null;
	geo: Geo | null;
	slot: number; // index into the colour palette
	scale: number; // cursor size
	trail: number[]; // flat [x0, y0, x1, y1, …], newest last
}

interface Ghost {
	target: Target;
	t0: number;
	color: string;
}

interface Ripple {
	x: number;
	y: number;
	t0: number;
	color: string;
}

type RGB = [number, number, number];

export interface SwarmEngine {
	preview: () => void;
	start: () => void;
	replay: () => void;
	destroy: () => void;
}

const ROOT_SELECTORS = [
	"body > header",
	".my-container > header",
	"body > aside",
	".home-page",
];
const FLOW_ROOT = ".home-page";
const MAX_TARGETS = 700;
const STUCK_MS = 10000;
const FADE_MS = 900;
const INTRO_MS = 1500;
const TRAIL_POINTS = 9;
const ASSIST_MIN_AREA = 110000;
const TYPE_MAX_CHARS = 1600;

const SKIP_TAGS = new Set([
	"script",
	"style",
	"noscript",
	"template",
	"link",
	"meta",
]);
const ATOMIC_BOX = new Set([
	"img",
	"picture",
	"svg",
	"video",
	"canvas",
	"iframe",
	"input",
	"textarea",
	"select",
	"button",
	"a",
]);
const ATOMIC_TEXT = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "label"]);
const RICH_CHILDREN = "p,h1,h2,h3,h4,h5,h6,img,picture";
const SVG_SHAPES = new Set([
	"circle",
	"ellipse",
	"path",
	"line",
	"polyline",
	"polygon",
	"rect",
	"g",
]);

const clamp = (v: number, lo: number, hi: number) =>
	Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function parseColor(str: string, fallback: RGB): RGB {
	const s = str.trim();
	const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hex) {
		let h = hex[1];
		if (h.length === 3)
			h = h
				.split("")
				.map((c) => c + c)
				.join("");
		return [
			parseInt(h.slice(0, 2), 16),
			parseInt(h.slice(2, 4), 16),
			parseInt(h.slice(4, 6), 16),
		];
	}
	const rgb = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
	if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
	return fallback;
}

// ───────────────────────── discovery ─────────────────────────

function colorAlpha(c: string): number {
	if (!c || c === "transparent") return 0;
	const slash = c.match(/\/\s*([\d.]+)(%?)\s*\)\s*$/);
	if (slash) {
		const v = parseFloat(slash[1]);
		return slash[2] ? v / 100 : v;
	}
	const rgba = c.match(/^rgba\(([^)]+)\)$/);
	if (rgba) {
		const parts = rgba[1].split(",");
		if (parts.length === 4) return parseFloat(parts[3]);
	}
	return 1;
}

function hasVisibleBox(cs: CSSStyleDeclaration): boolean {
	if (colorAlpha(cs.backgroundColor) > 0.02) return true;
	const clipsToText =
		cs.backgroundClip === "text" ||
		(cs as CSSStyleDeclaration & { webkitBackgroundClip?: string })
			.webkitBackgroundClip === "text";
	if (!clipsToText && cs.backgroundImage !== "none") return true;
	const sides: Array<[string, string]> = [
		[cs.borderTopWidth, cs.borderTopStyle],
		[cs.borderRightWidth, cs.borderRightStyle],
		[cs.borderBottomWidth, cs.borderBottomStyle],
		[cs.borderLeftWidth, cs.borderLeftStyle],
	];
	if (sides.some(([w, s]) => parseFloat(w) > 0 && s !== "none")) return true;
	return cs.boxShadow !== "none";
}

function hasDirectText(el: Element): boolean {
	for (const n of Array.from(el.childNodes)) {
		if (n.nodeType === 3 && (n.textContent ?? "").trim() !== "")
			return true;
	}
	return false;
}

function textInfo(
	cs: CSSStyleDeclaration,
	r: DOMRect,
): { kind: Kind; lines: number } {
	const fs = parseFloat(cs.fontSize) || 16;
	const lh = parseFloat(cs.lineHeight) || fs * 1.3;
	const lines = Math.max(1, r.height / lh);
	return { kind: lines > 1.7 ? "block" : "text", lines };
}

function makeTarget(
	el: El,
	kind: Kind,
	lines: number,
	parent: Target | null,
): Target {
	return {
		el,
		kind,
		lines,
		state: "pending",
		parent,
		inView: false,
		forced: false,
		viewSince: 0,
		releasedAt: 0,
		agent: null,
		assist: null,
		assisted: false,
		progress: 0,
		typing: undefined,
	};
}

/**
 * @param root        element to walk
 * @param fixedRoot   root itself may be position:fixed (e.g. the sidebar)
 * @param onlyVisible skip anything currently outside the viewport (header / sidebar)
 */
function discover(
	root: El,
	fixedRoot: boolean,
	onlyVisible: boolean,
	out: Target[],
) {
	const visit = (
		el: El,
		parent: Target | null,
		isRoot: boolean,
		drawing: boolean,
	) => {
		if (out.length >= MAX_TARGETS) return;
		const tag = el.localName;
		if (SKIP_TAGS.has(tag) || el.hasAttribute("data-swarm-ignore")) return;

		const cs = getComputedStyle(el);
		if (cs.display === "none" || cs.visibility === "hidden") return;
		if (cs.position === "fixed" && !(isRoot && fixedRoot)) return;

		const r = el.getBoundingClientRect();
		if (
			onlyVisible &&
			(r.right < 0 ||
				r.left > window.innerWidth ||
				r.bottom < 0 ||
				r.top > window.innerHeight)
		) {
			return;
		}

		const drawHost = el.hasAttribute("data-swarm-draw");
		const sized = r.width >= 8 && r.height >= 8;
		let kind: Kind | null = null;
		let lines = 1;
		let atomic = false;

		if (
			drawing &&
			el instanceof SVGElement &&
			SVG_SHAPES.has(tag) &&
			r.width >= 2 &&
			r.height >= 2
		) {
			// Individual decoration shapes are traced by a cursor.
			kind = "draw";
			atomic = true;
		} else if (sized && !drawHost) {
			if (ATOMIC_BOX.has(tag)) {
				const isWrapper =
					(tag === "a" || tag === "button") &&
					el.querySelector(RICH_CHILDREN) !== null;
				if (!isWrapper) {
					kind =
						tag === "img" && el.hasAttribute("data-swarm-paint")
							? "paint"
							: "box";
					atomic = true;
				}
			} else if (ATOMIC_TEXT.has(tag)) {
				({ kind, lines } = textInfo(cs, r));
				atomic = true;
			} else if (hasVisibleBox(cs) && r.width >= 24 && r.height >= 14) {
				kind = "box";
			} else if (hasDirectText(el)) {
				({ kind, lines } = textInfo(cs, r));
				atomic = true;
			}
		}

		let me = parent;
		if (kind) {
			me = makeTarget(el, kind, lines, parent);
			out.push(me);
		}

		if (!atomic) {
			for (const child of Array.from(el.children)) {
				if (
					child instanceof HTMLElement ||
					child instanceof SVGElement
				) {
					visit(child, me, false, drawing || drawHost);
				}
			}
		}
	};

	visit(root, null, true, false);
}

/**
 * Pre-measure where each typing step ends, so text can be typed in
 * instead of wiped: short text goes character by character, long
 * text a word at a time (measuring every character of a paragraph
 * would be wasteful). Alongside the single-line clip percentages,
 * each step records which line it lands on and where the caret is,
 * so multi-line text can be revealed line by line, following the
 * cursor. Returns null when the text is too long or can't be
 * measured (the smooth wipe is used instead).
 */
function measureTyping(
	el: El,
	r: DOMRect,
	rtl: boolean,
): {
	clips: number[];
	fx: number[];
	fy: number[];
	edge: number[];
	lineTop: number[];
	lineBottom: number[];
} | null {
	const nodes: Text[] = [];
	const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
	let total = 0;
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		const tn = n as Text;
		nodes.push(tn);
		total += tn.data.length;
		if (total > TYPE_MAX_CHARS) return null;
	}
	if (total < 3 || r.width < 20) return null;

	const perChar = total <= 120;
	const clips: number[] = [100];
	const fx: number[] = [rtl ? r.right : r.left];
	const fy: number[] = [(r.top + r.bottom) / 2];
	const edge: number[] = [rtl ? 1 : 0];
	const lineTop: number[] = [0];
	const lineBottom: number[] = [0];
	const range = document.createRange();
	let done = 0;
	let prevClip = 100;
	for (const tn of nodes) {
		for (let i = 1; i <= tn.data.length; i++) {
			done++;
			// In word mode only measure at word ends.
			if (!perChar && i < tn.data.length && !/\s/.test(tn.data[i]))
				continue;
			range.setStart(nodes[0], 0);
			range.setEnd(tn, i);
			const rr = range.getBoundingClientRect();
			const edgeX = rtl ? rr.left : rr.right;
			const clip = rtl
				? ((edgeX - r.left) / r.width) * 100
				: ((r.right - edgeX) / r.width) * 100;
			prevClip = Math.min(prevClip, clamp(clip, 0, 100));
			clips.push(prevClip);
			fx.push(edgeX);
			const rects = range.getClientRects();
			const last = rects[rects.length - 1];
			if (last && r.height > 0) {
				fy.push((last.top + last.bottom) / 2);
				edge.push(
					clamp(
						((rtl ? last.left : last.right) - r.left) / r.width,
						0,
						1,
					),
				);
				lineTop.push(clamp((last.top - r.top) / r.height, 0, 1));
				lineBottom.push(clamp((last.bottom - r.top) / r.height, 0, 1));
			} else {
				fy.push(fy[fy.length - 1]);
				edge.push(edge[edge.length - 1]);
				lineTop.push(lineTop[lineTop.length - 1]);
				lineBottom.push(lineBottom[lineBottom.length - 1]);
			}
		}
	}
	if (done !== total) return null;
	clips[clips.length - 1] = 0;
	edge[edge.length - 1] = rtl ? 0 : 1;
	lineBottom[lineBottom.length - 1] = 1;
	return { clips, fx, fy, edge, lineTop, lineBottom };
}

// ───────────────────────── engine ─────────────────────────

export function createSwarm(): SwarmEngine {
	const noop: SwarmEngine = {
		preview: () => {},
		start: () => {},
		replay: () => {},
		destroy: () => {},
	};
	if (typeof window === "undefined") return noop;

	const html = document.documentElement;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		return noop;

	// Hide the page while the boot screen is up so nothing flashes once it leaves.
	html.setAttribute("data-swarm", "arming");

	let live = false; // canvas + loop exist (cursors can be drawn)
	let started = false; // page is armed (elements hidden / being built)
	let previewing = false; // cursors circle the boot screen, waiting for start()
	let destroyed = false;
	let running = false;
	let raf = 0;
	let lastT = 0;
	let lastReady = 0;
	let lastWork = 0;
	let lastScrollY = 0;
	let scrollSpeed = 0;
	let vw = window.innerWidth;
	let vh = window.innerHeight;
	let rtl = false;
	let colors = { primary: "#2563eb", surface: "#ffffff" };
	let spawnCount = 0;
	let introStart = 0;
	let introEnd = 0;
	let introBurst = true;
	const pointer = { x: -9999, y: -9999, t: 0 };

	// Distinct, clearly different hues — all read from the site's own tokens.
	const TOKENS: Array<[string, RGB]> = [
		["--primary", [37, 99, 235]],
		["--warning", [245, 158, 11]],
		["--success", [22, 163, 74]],
		["--danger", [239, 68, 68]],
		["--info", [6, 182, 212]],
	];
	let palette: string[] = TOKENS.map(
		([, rgb]) => `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
	);

	let targets: Target[] = [];
	let ready: Target[] = [];
	const agents: Agent[] = [];
	const ghosts: Ghost[] = [];
	const ripples: Ripple[] = [];
	const releasing: Target[] = [];
	const byEl = new WeakMap<Element, Target>();

	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let io: IntersectionObserver | null = null;
	let mo: MutationObserver | null = null;

	// ── helpers ──

	const readEnv = () => {
		const cs = getComputedStyle(html);
		const primary = cs.getPropertyValue("--primary").trim();
		const surface = cs.getPropertyValue("--surface").trim();
		colors = {
			primary: primary || colors.primary,
			surface: surface || colors.surface,
		};
		palette = TOKENS.map(([name, fallback]) => {
			const c = parseColor(cs.getPropertyValue(name), fallback);
			return `rgb(${c[0]},${c[1]},${c[2]})`;
		});
		rtl = cs.direction === "rtl";
	};

	const resize = () => {
		if (!canvas || !ctx) return;
		vw = window.innerWidth;
		vh = window.innerHeight;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.round(vw * dpr);
		canvas.height = Math.round(vh * dpr);
		canvas.style.width = `${vw}px`;
		canvas.style.height = `${vh}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	const geoOf = (r: DOMRect): Geo => {
		const x0 = rtl ? r.right : r.left;
		const x1 = rtl ? r.left : r.right;
		return {
			sx: clamp(x0, 6, vw - 6),
			sy: clamp(r.top, 6, vh - 6),
			ex: clamp(x1, 6, vw - 6),
			ey: clamp(r.bottom, 6, vh - 6),
			cx: clamp((r.left + r.right) / 2, 6, vw - 6),
			cy: clamp((r.top + r.bottom) / 2, 6, vh - 6),
		};
	};

	const viewable = (t: Target) => t.inView || t.forced;

	const parentsReleased = (t: Target) => {
		for (let p = t.parent; p; p = p.parent) {
			if (p.el.isConnected && p.state === "pending") return false;
		}
		return true;
	};

	const beginRelease = (t: Target, now: number) => {
		if (t.state !== "pending") return;
		t.state = "building";
		t.releasedAt = now;
		t.el.setAttribute("data-swarm-state", "building");
		if (t.kind === "text" || t.kind === "block")
			t.el.style.setProperty("--swarm-clip", "100");
		if (t.kind === "draw" || t.kind === "paint")
			t.el.style.setProperty("--swarm-draw", "0");
		releasing.push(t);
	};

	const clearAttrs = (t: Target) => {
		t.el.removeAttribute("data-swarm-state");
		t.el.removeAttribute("data-swarm-kind");
		t.el.style.removeProperty("--swarm-clip");
		t.el.style.removeProperty("--swarm-draw");
		t.el.style.clipPath = "";
	};

	const finalize = (t: Target) => {
		t.state = "done";
		clearAttrs(t);
		io?.unobserve(t.el);
	};

	const dropAgentTarget = (a: Agent) => {
		const t = a.target;
		if (t) {
			if (t.agent === a) {
				t.agent = null;
				if (t.state === "pending") t.assisted = false;
			}
			if (t.assist === a) t.assist = null;
		}
		a.target = null;
		a.phase = "idle";
		a.role = "lead";
	};

	const agentColor = (a: Agent): string => palette[a.slot % palette.length];

	// A short press, used when a cursor "clicks" a button or link.
	const pressEl = (el: El) => {
		try {
			el.animate(
				[
					{ transform: "scale(1)" },
					{ transform: "scale(0.93)" },
					{ transform: "scale(1)" },
				],
				{ duration: 280, easing: "ease-out", composite: "add" },
			);
		} catch {
			/* animations unsupported — no press, no problem */
		}
	};

	const spawn = (n: number, now: number) => {
		const inIntro = now < introEnd;
		const ox = vw / 2;
		const oy = vh / 2 - 10;
		for (let i = 0; i < n; i++) {
			const seed = Math.random() * 100;
			let x = vw * (0.35 + Math.random() * 0.3);
			let y = vh * (0.45 + Math.random() * 0.1);
			let vx = 0;
			let vy = 0;
			if (inIntro) {
				const ang = Math.random() * Math.PI * 2;
				const rx = previewing
					? clamp(vw * 0.26, 110, 300)
					: 50 + Math.random() * 60;
				const ry = previewing ? 62 : rx * 0.75;
				x = ox + Math.cos(ang) * rx;
				y = oy + Math.sin(ang) * ry;
			} else {
				const ang = Math.random() * Math.PI * 2;
				const sp = 300 + Math.random() * 400;
				vx = Math.cos(ang) * sp;
				vy = Math.sin(ang) * sp;
			}
			agents.push({
				x,
				y,
				vx,
				vy,
				alpha: 0,
				dying: false,
				seed,
				phase: "idle",
				role: "lead",
				target: null,
				t0: now,
				dur: 1,
				rect: null,
				geo: null,
				slot: spawnCount++ % TOKENS.length,
				scale: 0.7 + Math.random() * 0.2,
				trail: [],
			});
		}
	};

	// ── per-frame logic ──

	const refreshReady = (now: number) => {
		targets = targets.filter((t) =>
			t.state === "done" ? false : t.el.isConnected,
		);

		for (const t of targets) {
			if (t.state === "pending" && t.inView) {
				for (let p = t.parent; p; p = p.parent) {
					if (p.state === "pending") p.forced = true;
				}
			}
		}

		ready = [];
		for (const t of targets) {
			if (t.state !== "pending") continue;
			if (!viewable(t)) {
				t.viewSince = 0;
				continue;
			}
			if (!t.viewSince) t.viewSince = now;
			if (now - t.viewSince > STUCK_MS && !t.agent) {
				beginRelease(t, now);
				continue;
			}
			if (!t.agent && parentsReleased(t)) ready.push(t);
		}

		const keyed = ready.map((t) => {
			const r = t.el.getBoundingClientRect();
			return {
				t,
				row: Math.round(r.top / 40),
				col: rtl ? -r.right : r.left,
			};
		});
		keyed.sort((a, b) => a.row - b.row || a.col - b.col);
		ready = keyed.map((k) => k.t);
	};

	const seek = (
		a: Agent,
		tx: number,
		ty: number,
		dt: number,
		maxSpeed: number,
		maxForce: number,
	) => {
		const dx = tx - a.x;
		const dy = ty - a.y;
		const dist = Math.hypot(dx, dy) || 1;
		const slow = Math.min(1, dist / 220);
		let ax = (dx / dist) * maxSpeed * slow - a.vx;
		let ay = (dy / dist) * maxSpeed * slow - a.vy;
		const len = Math.hypot(ax, ay);
		const lim = maxForce * dt;
		if (len > lim) {
			ax *= lim / len;
			ay *= lim / len;
		}
		a.vx += ax;
		a.vy += ay;
		a.x += a.vx * dt;
		a.y += a.vy * dt;
		return dist;
	};

	const flock = (a: Agent, dt: number, now: number) => {
		let sx = 0;
		let sy = 0;
		let cx = 0;
		let cy = 0;
		let avx = 0;
		let avy = 0;
		let n = 0;
		for (const b of agents) {
			if (b === a || b.dying) continue;
			const dx = a.x - b.x;
			const dy = a.y - b.y;
			const d2 = dx * dx + dy * dy;
			if (d2 < 150 * 150) {
				cx += b.x;
				cy += b.y;
				avx += b.vx;
				avy += b.vy;
				n++;
			}
			if (d2 < 46 * 46 && d2 > 0.01) {
				const d = Math.sqrt(d2);
				sx += (dx / d) * (46 - d);
				sy += (dy / d) * (46 - d);
			}
		}
		let ax = sx * 60;
		let ay = sy * 60;
		if (n) {
			ax += (cx / n - a.x) * 1.2 + (avx / n - a.vx) * 1.5;
			ay += (cy / n - a.y) * 1.2 + (avy / n - a.vy) * 1.5;
		}
		// Hover around the lower-middle of the viewport, where new content arrives.
		const tx = vw * 0.5 + Math.sin(now / 1700 + a.seed) * vw * 0.22;
		const ty = vh * 0.62 + Math.cos(now / 1300 + a.seed * 1.7) * vh * 0.18;
		ax += (tx - a.x) * 2.2;
		ay += (ty - a.y) * 2.2;

		// Run away from the visitor's mouse.
		if (now - pointer.t < 2500) {
			const px = a.x - pointer.x;
			const py = a.y - pointer.y;
			const pd = Math.hypot(px, py);
			if (pd < 170 && pd > 0.01) {
				const k = 1 - pd / 170;
				const push = k * k * 3200;
				ax += (px / pd) * push;
				ay += (py / pd) * push;
			}
		}

		a.vx += ax * dt;
		a.vy += ay * dt;
		a.vx *= 1 - 0.8 * dt;
		a.vy *= 1 - 0.8 * dt;
		const sp = Math.hypot(a.vx, a.vy);
		const cap = now - pointer.t < 2500 ? 600 : 420;
		if (sp > cap) {
			a.vx *= cap / sp;
			a.vy *= cap / sp;
		}
		a.x += a.vx * dt;
		a.y += a.vy * dt;
	};

	// During the intro the swarm circles the middle of the screen.
	const orbit = (a: Agent, now: number) => {
		const cx = vw / 2;
		const cy = vh / 2 - (previewing ? 0 : 10);
		const dir = a.slot % 2 === 0 ? 1 : -1;
		const w = (2.2 + (a.seed % 1) * 1.2) * dir;
		const wide = previewing;
		const rx = wide ? clamp(vw * 0.26, 110, 300) : 50;
		const ry = wide ? 62 : 50;
		const k = 1 + ((a.seed * 7) % 1) * (wide ? 0.35 : 1.2);
		const th = a.seed + ((now - introStart) / 1000) * w;
		const px = a.x;
		const py = a.y;
		const tx = cx + Math.cos(th) * rx * k;
		const ty = cy + Math.sin(th) * ry * k;
		a.x = lerp(a.x, tx, 0.18);
		a.y = lerp(a.y, ty, 0.18);
		a.vx = (a.x - px) * 60;
		a.vy = (a.y - py) * 60;
	};

	// Durations run a touch slower than the raw formulas — the
	// building should read as drawing, not as a flash.
	const buildDuration = (t: Target, r: DOMRect) => {
		if (t.typing)
			return clamp(250 + t.typing.clips.length * 55, 500, 2200) * 1.35;
		if (t.kind === "paint")
			return (
				clamp(720 + Math.hypot(r.width, r.height) * 0.32, 800, 1800) *
				1.35
			);
		if (t.kind === "draw")
			return (
				clamp(360 + Math.hypot(r.width, r.height) * 0.7, 500, 1300) *
				1.35
			);
		if (t.kind === "box")
			return (
				clamp(480 + 0.62 * Math.sqrt(r.width * r.height), 600, 1700) *
				1.35
			);
		if (t.kind === "text")
			return clamp(300 + r.width * 0.95, 400, 1500) * 1.35;
		return clamp(380 + Math.min(8, t.lines) * 260, 620, 2300) * 1.35;
	};

	const finishBuild = (a: Agent, t: Target, now: number) => {
		beginRelease(t, now);
		t.releasedAt = now;
		t.agent = null;
		if (t.kind === "text" || t.kind === "block") {
			t.el.style.setProperty("--swarm-clip", "0");
			t.el.style.clipPath = "";
		} else if (t.kind === "draw" || t.kind === "paint") {
			t.el.style.setProperty("--swarm-draw", "1");
			if (t.kind === "paint")
				ghosts.push({ target: t, t0: now, color: agentColor(a) });
		} else {
			const col = agentColor(a);
			ghosts.push({ target: t, t0: now, color: col });
			const tag = t.el.localName;
			if (tag === "button" || tag === "a") {
				ripples.push({ x: a.x, y: a.y, t0: now, color: col });
				pressEl(t.el);
			}
		}
		a.target = null;
		a.phase = "idle";
		a.role = "lead";
		a.vx = clamp(a.vx, -400, 400);
		a.vy = clamp(a.vy, -400, 400);
	};

	const stepAssist = (a: Agent, t: Target, now: number, dt: number) => {
		// The assisting cursor works the opposite corner of a big box.
		if (t.assist !== a || !t.agent || !t.el.isConnected) {
			dropAgentTarget(a);
			return;
		}
		const r = t.el.getBoundingClientRect();
		const g = geoOf(r);
		a.rect = r;
		a.geo = g;

		if (a.phase === "fly" || a.phase === "hold") {
			const d = seek(a, g.cx + 12, g.cy + 9, dt, 1150, 3800);
			if (a.phase === "fly" && d < 10 && Math.hypot(a.vx, a.vy) < 400)
				a.phase = "hold";
			return;
		}
		// build: mirror the lead's progress
		a.x = lerp(g.cx + 12, g.ex, t.progress);
		a.y = lerp(g.cy + 9, g.ey, t.progress);
		a.vx = 0;
		a.vy = 0;
	};

	const stepAgent = (a: Agent, now: number, dt: number, speedMul: number) => {
		if (a.phase === "idle") {
			a.rect = null;
			if (now < introEnd) orbit(a, now);
			else flock(a, dt, now);
			return;
		}
		const t = a.target;
		if (!t || !t.el.isConnected) {
			dropAgentTarget(a);
			return;
		}
		if (a.role === "assist") {
			stepAssist(a, t, now, dt);
			return;
		}

		const r = t.el.getBoundingClientRect();
		const g = geoOf(r);
		a.rect = r;
		a.geo = g;

		if (a.phase === "fly") {
			if (!viewable(t)) {
				dropAgentTarget(a);
				return;
			}
			const wantX = t.assisted ? g.cx - 12 : g.sx;
			const wantY = t.assisted ? g.cy - 9 : g.sy;
			const d = seek(a, wantX, wantY, dt, 1150, 3800);
			const speed = Math.hypot(a.vx, a.vy);
			const arrived = (d < 10 && speed < 400) || d < 3;
			const timedOut = now - a.t0 > 3200;
			const partnerReady =
				!t.assisted || !t.assist || t.assist.phase === "hold";
			if (
				(arrived && (partnerReady || now - a.t0 > 4500)) ||
				(timedOut && partnerReady)
			) {
				a.phase = "build";
				a.t0 = now;
				if (
					(t.kind === "text" || t.kind === "block") &&
					t.typing === undefined
				) {
					t.typing = measureTyping(t.el, r, rtl);
				}
				a.dur =
					(buildDuration(t, r) / speedMul) * (t.assisted ? 0.65 : 1);
				a.x = wantX;
				a.y = wantY;
				if (t.assisted && t.assist && t.assist.phase === "hold") {
					t.assist.phase = "build";
					t.assist.t0 = now;
				}
				if (t.kind !== "box") beginRelease(t, now);
			}
			return;
		}

		// build
		const p = clamp((now - a.t0) / a.dur, 0, 1);
		const e = easeInOut(p);
		t.progress = e;
		const offscreen = r.bottom < 0 || r.top > vh;
		const px = a.x;
		const py = a.y;

		if (t.kind === "box") {
			if (t.assisted) {
				a.x = lerp(g.cx - 12, g.sx, e);
				a.y = lerp(g.cy - 9, g.sy, e);
			} else {
				a.x = lerp(g.sx, g.ex, e);
				a.y = lerp(g.sy, g.ey, e);
			}
			if (p >= 0.55) beginRelease(t, now);
		} else if (t.kind === "draw" || t.kind === "paint") {
			// The cursor travels across the shape while the CSS traces / paints it.
			a.x = lerp(g.sx, g.ex, e);
			a.y = t.kind === "paint" ? g.cy : lerp(g.sy, g.ey, e);
			t.el.style.setProperty("--swarm-draw", String(e));
		} else if (t.kind === "text" || t.kind === "block") {
			if (t.typing && t.lines > 1.7) {
				// Typed across its lines: the reveal follows the cursor
				// line by line — finished lines stay fully visible, the
				// current line opens up to the caret, the rest is hidden.
				const len = t.typing.clips.length - 1;
				const n = Math.min(len, Math.floor(p * (len + 0.999)));
				a.x = clamp(t.typing.fx[n], 6, vw - 6);
				a.y = clamp(t.typing.fy[n], 6, vh - 6);
				const ex = (t.typing.edge[n] * 100).toFixed(2);
				const lt = (t.typing.lineTop[n] * 100).toFixed(2);
				const lb = (t.typing.lineBottom[n] * 100).toFixed(2);
				t.el.style.clipPath = rtl
					? `polygon(0% 0%, 100% 0%, 100% ${lb}%, ${ex}% ${lb}%, ${ex}% ${lt}%, 0% ${lt}%)`
					: `polygon(0% 0%, 100% 0%, 100% ${lt}%, ${ex}% ${lt}%, ${ex}% ${lb}%, 0% ${lb}%)`;
			} else if (t.kind === "text") {
				a.y = clamp((r.top + r.bottom) / 2, 6, vh - 6);
				if (t.typing) {
					// typed one character at a time
					const len = t.typing.clips.length - 1;
					const n = Math.min(len, Math.floor(p * (len + 0.999)));
					a.x = clamp(t.typing.fx[n], 6, vw - 6);
					t.el.style.setProperty(
						"--swarm-clip",
						String(t.typing.clips[n]),
					);
				} else {
					a.x = lerp(g.sx, g.ex, e);
					t.el.style.setProperty(
						"--swarm-clip",
						String((1 - e) * 100),
					);
				}
			} else {
				// Block text that could not be measured: line sweep.
				const n = Math.min(8, Math.max(1, Math.round(t.lines)));
				const raw = e * n;
				const frac = e >= 1 ? 1 : raw - Math.floor(raw);
				a.x = lerp(g.sx, g.ex, easeInOut(frac));
				a.y = clamp(lerp(r.top, r.bottom, e), 6, vh - 6);
				t.el.style.setProperty("--swarm-clip", String((1 - e) * 100));
			}
		}
		a.vx = (a.x - px) / Math.max(dt, 0.001);
		a.vy = (a.y - py) / Math.max(dt, 0.001);

		if (p >= 1 || offscreen) finishBuild(a, t, now);
	};

	const update = (now: number, dt: number) => {
		const y = window.scrollY;
		const v = Math.abs(y - lastScrollY) / Math.max(dt, 0.001);
		lastScrollY = y;
		scrollSpeed += (v - scrollSpeed) * Math.min(1, dt * 6);

		for (let i = releasing.length - 1; i >= 0; i--) {
			const t = releasing[i];
			if (!t.el.isConnected) {
				releasing.splice(i, 1);
				t.state = "done";
			} else if (!t.agent && now - t.releasedAt > FADE_MS) {
				releasing.splice(i, 1);
				finalize(t);
			}
		}

		if (now - lastReady > 80) {
			lastReady = now;
			refreshReady(now);
		}

		const intro = now < introEnd;
		if (!intro && !introBurst) {
			// end of the intro: the swarm bursts outward from the middle
			introBurst = true;
			for (const a of agents) {
				const dx = a.x - vw / 2;
				const dy = a.y - (vh / 2 - 10);
				const d = Math.hypot(dx, dy) || 1;
				a.vx = (dx / d) * 650;
				a.vy = (dy / d) * 650;
			}
		}

		const active = agents.some((a) => a.phase !== "idle");
		if (intro || ready.length > 0 || active || scrollSpeed > 40)
			lastWork = now;

		const mobile = vw < 768;
		const base = mobile ? 6 : 10;
		const max = mobile ? 14 : 28;
		let desired = 0;
		if (intro) {
			desired = base;
		} else if (now - lastWork < 1800) {
			desired = Math.min(
				max,
				Math.round(base + ready.length * 0.5 + scrollSpeed / 260),
			);
		}
		const living = agents.filter((a) => !a.dying).length;
		if (living < desired) {
			spawn(desired - living, now);
		} else if (living > desired) {
			let extra = living - desired;
			for (const a of agents) {
				if (extra <= 0) break;
				if (!a.dying && a.phase === "idle") {
					a.dying = true;
					extra--;
				}
			}
		}

		// Hand out work: each free cursor takes a nearby block from the front of the queue.
		if (!intro) {
			const free = agents.filter(
				(a) => a.phase === "idle" && !a.dying && a.alpha > 0.3,
			);
			for (const a of free) {
				if (!ready.length) break;
				if (a.phase !== "idle") continue; // may have been taken as an assistant
				let best = -1;
				let bestScore = Infinity;
				const lookahead = Math.min(8, ready.length);
				for (let i = 0; i < lookahead; i++) {
					const r = ready[i].el.getBoundingClientRect();
					const d = Math.hypot(
						(rtl ? r.right : r.left) - a.x,
						r.top - a.y,
					);
					const score = i * 40 + d * 0.5;
					if (score < bestScore) {
						bestScore = score;
						best = i;
					}
				}
				if (best < 0) break;
				const [t] = ready.splice(best, 1);
				t.agent = a;
				a.target = t;
				a.role = "lead";
				a.phase = "fly";
				a.t0 = now;

				// Big boxes get a second cursor: both pull opposite corners out from the middle.
				if (t.kind === "box" && !mobile) {
					const r = t.el.getBoundingClientRect();
					if (r.width * r.height >= ASSIST_MIN_AREA) {
						let helper: Agent | null = null;
						let hd = Infinity;
						for (const b of free) {
							if (
								b === a ||
								b.phase !== "idle" ||
								b.dying ||
								b.alpha <= 0.3
							)
								continue;
							const d = Math.hypot(b.x - a.x, b.y - a.y);
							if (d < hd) {
								hd = d;
								helper = b;
							}
						}
						if (helper) {
							t.assisted = true;
							t.assist = helper;
							helper.target = t;
							helper.role = "assist";
							helper.phase = "fly";
							helper.t0 = now;
						}
					}
				}
			}
		}

		const speedMul = clamp(
			1 + ready.length * 0.04 + scrollSpeed / 1500,
			1,
			2.2,
		);
		for (let i = agents.length - 1; i >= 0; i--) {
			const a = agents[i];
			a.alpha = a.dying
				? a.alpha - dt * 3
				: Math.min(1, a.alpha + dt * 4);
			if (a.dying && a.alpha <= 0) {
				dropAgentTarget(a);
				agents.splice(i, 1);
				continue;
			}
			stepAgent(a, now, dt, speedMul);

			if (a.phase === "build") {
				a.trail.length = 0;
			} else {
				const n = a.trail.length;
				if (
					n === 0 ||
					Math.hypot(a.x - a.trail[n - 2], a.y - a.trail[n - 1]) > 3
				) {
					a.trail.push(a.x, a.y);
					if (a.trail.length > TRAIL_POINTS * 2) a.trail.splice(0, 2);
				}
			}
		}

		for (let i = ghosts.length - 1; i >= 0; i--) {
			if (now - ghosts[i].t0 > 420) ghosts.splice(i, 1);
		}
		for (let i = ripples.length - 1; i >= 0; i--) {
			if (now - ripples[i].t0 > 550) ripples.splice(i, 1);
		}
	};

	// ── drawing ──

	const drawGuide = (
		c: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		alpha: number,
		handles: boolean,
		col: string,
	) => {
		c.globalAlpha = alpha * 0.07;
		c.fillStyle = col;
		c.fillRect(x, y, w, h);
		c.globalAlpha = alpha * 0.9;
		c.strokeStyle = col;
		c.lineWidth = 1.25;
		c.strokeRect(x + 0.5, y + 0.5, w, h);
		if (!handles || w < 28 || h < 18) return;
		c.globalAlpha = alpha;
		c.fillStyle = colors.surface;
		for (const [hx, hy] of [
			[x, y],
			[x + w, y],
			[x, y + h],
			[x + w, y + h],
		]) {
			c.fillRect(hx - 3, hy - 3, 6, 6);
			c.strokeRect(hx - 3 + 0.5, hy - 3 + 0.5, 6, 6);
		}
	};

	const drawTrail = (c: CanvasRenderingContext2D, a: Agent, col: string) => {
		const pts = a.trail;
		const n = pts.length / 2;
		if (n < 2) return;
		c.lineCap = "round";
		c.lineJoin = "round";
		c.strokeStyle = col;
		for (let i = 1; i < n; i++) {
			const k = i / n;
			c.globalAlpha = Math.max(0, a.alpha) * k * 0.55;
			c.lineWidth = (0.6 + k * 2.2) * a.scale;
			c.beginPath();
			c.moveTo(pts[(i - 1) * 2], pts[(i - 1) * 2 + 1]);
			c.lineTo(pts[i * 2], pts[i * 2 + 1]);
			c.stroke();
		}
	};

	const drawCursor = (c: CanvasRenderingContext2D, a: Agent, col: string) => {
		const building = a.phase === "build" && a.target !== null;
		const mode: "arrow" | "cross" | "beam" =
			building &&
			(a.target!.kind === "text" || a.target!.kind === "block")
				? "beam"
				: building
					? "cross"
					: "arrow";

		c.save();
		c.translate(a.x, a.y);
		c.globalAlpha = Math.max(0, a.alpha);
		c.shadowColor = "rgba(0,0,0,0.4)";
		c.shadowBlur = 5;
		c.shadowOffsetY = 1.2;
		c.lineJoin = "round";
		c.lineCap = "round";

		if (mode === "beam") {
			// I-beam while typing across text
			c.scale(a.scale, a.scale);
			c.beginPath();
			c.moveTo(0, -9);
			c.lineTo(0, 9);
			c.moveTo(-3.5, -9);
			c.lineTo(3.5, -9);
			c.moveTo(-3.5, 9);
			c.lineTo(3.5, 9);
			c.strokeStyle = colors.surface;
			c.lineWidth = 3.8;
			c.stroke();
			c.strokeStyle = col;
			c.lineWidth = 1.7;
			c.stroke();
		} else if (mode === "cross") {
			// Crosshair while dragging out a rectangle
			c.scale(a.scale, a.scale);
			c.beginPath();
			c.moveTo(-9, 0);
			c.lineTo(9, 0);
			c.moveTo(0, -9);
			c.lineTo(0, 9);
			c.strokeStyle = colors.surface;
			c.lineWidth = 3.8;
			c.stroke();
			c.strokeStyle = col;
			c.lineWidth = 1.7;
			c.stroke();
		} else {
			// Soft, rounded pointer
			c.rotate(clamp(a.vx / 3000, -0.3, 0.3));
			c.scale(a.scale, a.scale);
			c.beginPath();
			c.moveTo(0, 0);
			c.lineTo(0, 15);
			c.lineTo(4, 11.5);
			c.lineTo(7, 18);
			c.lineTo(9.6, 16.9);
			c.lineTo(6.7, 10.5);
			c.lineTo(11.5, 10.5);
			c.closePath();
			c.strokeStyle = colors.surface; // outer rim
			c.lineWidth = 3.6;
			c.stroke();
			c.strokeStyle = col; // same-colour stroke rounds the corners
			c.lineWidth = 1.9;
			c.stroke();
			c.fillStyle = col;
			c.fill();
		}
		c.restore();
	};

	const draw = (now: number) => {
		if (!ctx) return;
		const c = ctx;
		c.clearRect(0, 0, vw, vh);


		for (const gh of ghosts) {
			if (!gh.target.el.isConnected) continue;
			const r = gh.target.el.getBoundingClientRect();
			const k = 1 - (now - gh.t0) / 420;
			if (k <= 0) continue;
			drawGuide(c, r.left, r.top, r.width, r.height, k, false, gh.color);
			// a soft pulse that expands outward as the block lands
			const grow = (1 - k) * 12;
			c.globalAlpha = k * 0.55;
			c.strokeStyle = gh.color;
			c.lineWidth = 1.5;
			c.strokeRect(
				r.left - grow,
				r.top - grow,
				r.width + grow * 2,
				r.height + grow * 2,
			);
		}

		for (const rp of ripples) {
			const e = (now - rp.t0) / 550;
			if (e >= 1) continue;
			c.globalAlpha = (1 - e) * 0.7;
			c.strokeStyle = rp.color;
			c.lineWidth = 2;
			c.beginPath();
			c.arc(rp.x, rp.y, lerp(5, 30, easeInOut(e)), 0, Math.PI * 2);
			c.stroke();
		}

		for (const a of agents) {
			if (
				a.phase !== "build" ||
				!a.target ||
				!a.rect ||
				!a.geo ||
				a.role !== "lead"
			)
				continue;
			const t = a.target;
			const r = a.rect;
			const g = a.geo;
			const col = agentColor(a);
			if (t.kind === "box") {
				if (t.assisted) {
					const x1 = lerp(g.cx - 12, g.sx, t.progress);
					const y1 = lerp(g.cy - 9, g.sy, t.progress);
					const x2 = lerp(g.cx + 12, g.ex, t.progress);
					const y2 = lerp(g.cy + 9, g.ey, t.progress);
					drawGuide(
						c,
						Math.min(x1, x2),
						Math.min(y1, y2),
						Math.abs(x2 - x1),
						Math.abs(y2 - y1),
						a.alpha,
						true,
						col,
					);
				} else {
					drawGuide(
						c,
						Math.min(g.sx, a.x),
						Math.min(g.sy, a.y),
						Math.abs(a.x - g.sx),
						Math.abs(a.y - g.sy),
						a.alpha,
						true,
						col,
					);
				}
			} else if (t.kind === "paint") {
				const w = Math.max(0, r.width * t.progress);
				drawGuide(
					c,
					rtl ? r.right - w : r.left,
					r.top,
					w,
					r.height,
					a.alpha * 0.45,
					false,
					col,
				);
			} else if (t.kind === "text") {
				drawGuide(
					c,
					Math.min(g.sx, a.x),
					r.top,
					Math.abs(a.x - g.sx),
					r.height,
					a.alpha * 0.7,
					false,
					col,
				);
			} else {
				drawGuide(
					c,
					r.left,
					r.top,
					r.width,
					Math.max(0, a.y - r.top),
					a.alpha * 0.7,
					false,
					col,
				);
			}
		}

		c.globalAlpha = 1;
		for (const a of agents) {
			const col = agentColor(a);
			drawTrail(c, a, col);
			drawCursor(c, a, col);
		}
		c.globalAlpha = 1;
	};

	// ── loop ──

	const frame = (now: number) => {
		raf = 0;
		if (destroyed) return;
		const dt = Math.min(0.034, (now - lastT) / 1000 || 0.016);
		lastT = now;
		update(now, dt);
		draw(now);

		const more =
			agents.length > 0 ||
			ghosts.length > 0 ||
			ripples.length > 0 ||
			releasing.length > 0 ||
			ready.length > 0 ||
			now < introEnd ||
			now - lastWork < 1800;
		if (more) {
			raf = requestAnimationFrame(frame);
		} else {
			running = false;
			ctx?.clearRect(0, 0, vw, vh);
		}
	};

	const wake = () => {
		if (!live || destroyed || running) return;
		running = true;
		lastT = performance.now();
		raf = requestAnimationFrame(frame);
	};

	// ── lifecycle ──

	const onScroll = () => wake();
	const onResize = () => {
		resize();
		wake();
	};
	const onPointer = (e: PointerEvent) => {
		if (e.pointerType !== "mouse") return;
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.t = performance.now();
	};

	const clearTargets = () => {
		for (const t of targets) {
			clearAttrs(t);
			io?.unobserve(t.el);
		}
		for (const t of releasing) clearAttrs(t);
		targets = [];
		ready = [];
		releasing.length = 0;
	};

	const arm = () => {
		const found: Target[] = [];
		for (const sel of ROOT_SELECTORS) {
			const isFlow = sel === FLOW_ROOT;
			for (const root of Array.from(
				document.querySelectorAll<HTMLElement>(sel),
			)) {
				discover(root, !isFlow, !isFlow, found);
			}
		}
		targets = found;
		for (const t of targets) {
			byEl.set(t.el, t);
			t.el.setAttribute("data-swarm-state", "pending");
			t.el.setAttribute("data-swarm-kind", t.kind);
			io?.observe(t.el);
		}
		html.setAttribute("data-swarm", "on");
	};

	const beginIntro = (now: number) => {
		introStart = now;
		introEnd = now + INTRO_MS;
		introBurst = false;
		lastWork = now;
	};

	const teardown = () => {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		running = false;
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onResize);
		window.removeEventListener("pointermove", onPointer);
		clearTargets();
		io?.disconnect();
		mo?.disconnect();
		io = null;
		mo = null;
		canvas?.remove();
		canvas = null;
		ctx = null;
		html.removeAttribute("data-swarm");
		live = false;
	};

	/** Canvas, observers and listeners. Safe to call once. */
	const setup = (): boolean => {
		readEnv();
		canvas = document.createElement("canvas");
		canvas.setAttribute("aria-hidden", "true");
		canvas.style.cssText =
			"position:fixed;left:0;top:0;pointer-events:none;z-index:9998;";
		document.body.appendChild(canvas);
		ctx = canvas.getContext("2d");
		if (!ctx) return false;
		resize();

		io = new IntersectionObserver(
			(entries) => {
				for (const en of entries) {
					const t = byEl.get(en.target);
					if (t) t.inView = en.isIntersecting;
				}
				wake();
			},
			{ threshold: 0.01 },
		);

		lastScrollY = window.scrollY;
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);
		window.addEventListener("pointermove", onPointer, { passive: true });
		mo = new MutationObserver(readEnv);
		mo.observe(html, {
			attributes: true,
			attributeFilter: ["class", "dir", "lang"],
		});
		live = true;
		return true;
	};

	/** While the boot screen is up, the swarm already circles the name. */
	const preview = () => {
		if (live || started || destroyed) return;
		try {
			if (!setup()) {
				teardown();
				return;
			}
			previewing = true;
			const now = performance.now();
			introStart = now;
			introEnd = Infinity;
			introBurst = true;
			lastWork = now;
			wake();
		} catch {
			teardown();
		}
	};

	/** Boot screen is done: hide the page and start building it. */
	const start = () => {
		if (started || destroyed) return;
		started = true;
		try {
			if (!document.querySelector(FLOW_ROOT) || (!live && !setup())) {
				teardown();
				return;
			}
			arm();
			const now = performance.now();
			if (previewing) {
				// cursors are already out — burst straight into building
				previewing = false;
				introEnd = now;
				introBurst = false;
				lastWork = now;
			} else {
				beginIntro(now);
			}
			wake();
		} catch {
			teardown();
		}
	};

	/** Hide everything again and rebuild it from scratch. */
	const replay = () => {
		if (!started || destroyed || !canvas) return;
		try {
			for (const a of [...agents]) dropAgentTarget(a);
			agents.length = 0;
			ghosts.length = 0;
			ripples.length = 0;
			clearTargets();
			readEnv();
			arm();
			lastScrollY = window.scrollY;
			beginIntro(performance.now());
			wake();
		} catch {
			teardown();
		}
	};

	const destroy = () => {
		if (destroyed) return;
		destroyed = true;
		teardown();
	};

	return { preview, start, replay, destroy };
}
