import { GUI } from "dat.gui"

const settings = {
	reset: () => { },
	plot: () => { },
	pause: false,
	mode: "ball",
}

const gui = new GUI({ closeOnTop: true })
gui.add(settings, "reset")
gui.add(settings, "plot")
gui.add(settings, "pause")

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

const render = () => {
	if (!settings.pause) { }
}