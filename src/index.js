import compositing from "./util/compositing.js"
import modes from "./util/modes.js"
import { listen } from "./util/controls.js"
import { sign } from "./util/math.js"
import { plot_points } from "./util/plot.js"
import { GUI } from "dat.gui"
import './styles.scss'

// SETUP
// ==================================================== //

const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)
listen(canvas)

const context = canvas.getContext("2d", { willReadFrequently: true })

const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name, fallback) => JSON.parse(localStorage.getItem(name)) ?? fallback

const props = {
	count: get_storage("count", 0),
	points: get_storage("points", []),
	mode: get_storage("mode", "ball"),
	size: { x: canvas.width, y: canvas.height },
}

// GUI
// ==================================================== //

const settings = {
	reset: () => {
		props.count = 0
		props.points.length = 0
		context.reset()
	},
	plot: () => plot_points(props.mode, props.size, props.points, props.count),
	pause: false,
	compositing: "source-over",
	mode: props.mode,
}

const gui = new GUI({ closeOnTop: true })
gui.add(settings, "reset")
gui.add(settings, "plot")
gui.add(settings, "pause")
// gui.add(settings, "compositing", compositing)

const list = gui.add(settings, "mode", Object.keys(modes))

const handle_change = (value) => {
	props.mode = value
	props.count = 0
	props.points.length = 0
	context.reset()
}

list.onChange(handle_change)
list.domElement.addEventListener("wheel", (event) => {
	const options = Object.keys(modes)
	const delta = options.at((options.indexOf(props.mode) + sign(event.deltaY)) % options.length)
	handle_change(delta)
	list.setValue(delta)
})

// RENDER
// ==================================================== //

!function update() {
	!settings.pause && props.count++

	["pillar", "stalks"].includes(props.mode) || context.reset()
	// context.globalCompositeOperation = settings.compositing
	modes[props.mode](props.size, context, props.points, props.count) // fix args order

	set_storage("count", props.count)
	set_storage("points", props.points)
	set_storage("mode", props.mode)

	requestAnimationFrame(update)
}()