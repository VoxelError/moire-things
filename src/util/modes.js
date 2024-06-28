import ball from "../drawings/ball.js"
import bounce from "../drawings/bounce.js"
import cells from "../drawings/cells.js"
import circles from "../drawings/circles.js"
import fins from "../drawings/fins.js"
import heart from "../drawings/heart.js"
import larva from "../drawings/larva.js"
import legs from "../drawings/legs.js"
import lines from "../drawings/lines.js"
import orbs from "../drawings/orbs.js"
import pendulums from "../drawings/pendulums.js"
import petals from "../drawings/petals.js"
import pillar from "../drawings/pillar.js"
import pointer from "../drawings/pointer.js"
import radial from "../drawings/radial.js"
import snake from "../drawings/snake.js"
import speed from "../drawings/speed.js"
import sphere from "../drawings/sphere.js"
import spin from "../drawings/spin.js"
import squares from "../drawings/squares.js"
import stalks from "../drawings/stalks.js"
import stare from "../drawings/stare.js"
import stereo from "../drawings/stereo.js"
import sun from "../drawings/sun.js"
import trails from "../drawings/trails.js"
import tree from "../drawings/tree.js"
import twirls from "../drawings/twirls.js"

export const entries = {
	ball: ball,
	bounce: bounce,
	cells: cells,
	circles: circles,
	fins: fins,
	heart: heart,
	larva: larva,
	legs: legs,
	lines: lines,
	orbs: orbs,
	pendulums: pendulums,
	petals: petals,
	pillar: pillar,
	pointer: pointer,
	radial: radial,
	snake: snake,
	speed: speed,
	sphere: sphere,
	spin: spin,
	stalks: stalks,
	squares: squares,
	stare: stare,
	// stereo: stereo,
	sun: sun,
	trails: trails,
	tree: tree,
	twirls: twirls,
}

export default (mode) => {
	for (const entry in entries) {
		if (mode == entry) return entries[entry]
	}
}