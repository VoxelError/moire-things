import "./styles.scss"
import modes from "./util/modes.js"
import { listen } from "./util/controls.js"
import { GUI } from "dat.gui"
import { get_storage, set_storage } from "./util/helpers.js"

!navigator.gpu && alert("Your browser does not support WebGPU")

const canvas = document.getElementById("webgpu_canvas")
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
listen(canvas)

const settings = { mode: get_storage("mode", Object.keys(modes)[0]) }
let frame = () => { }
let gui

const points = get_storage("points", [])

const mode_selector = document.querySelector(".mode-selector")
for (const mode of Object.keys(modes)) {
	const option = document.createElement("option")
	option.value = mode
	option.textContent = mode
	mode_selector.appendChild(option)
}

const setup = async () => {
	const format = navigator.gpu.getPreferredCanvasFormat()
	const adapter = await navigator.gpu.requestAdapter()
	const device = await adapter.requestDevice()
	const queue = device.queue

	const context = canvas.getContext("webgpu")
	context.configure({ device, format, alphaMode: "premultiplied" })

	gui = new GUI({ closeOnTop: true })
	gui.useLocalStorage = true
	gui.domElement.style.userSelect = "none"
	set_storage("mode", settings.mode)

	frame = modes[settings.mode]({
		canvas,
		context,
		device,
		queue,
		format,
		points,
		gui,
	})

	const mode_select = gui.add(settings, "mode", Object.keys(modes))

	mode_select.onChange(() => {
		device.destroy()
		gui.destroy()
		points.length = 0
		set_storage("points", points)
		setup()
	})
}; setup()

const render = (time) => {
	frame(time)
	set_storage("points", points)
	requestAnimationFrame(render)
}; render()