import "./styles.scss"
import modes from "./util/modes.js"
import { listen } from "./util/controls.js"
import { GUI } from "dat.gui"
import { get_storage, set_storage } from "./util/helpers.js"

!navigator.gpu && alert("Your browser does not support WebGPU")

const canvas = document.getElementById("webgpu_canvas")
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
listen(canvas)

const points = get_storage("points", [])

let current_mode = get_storage("current_mode", Object.keys(modes)[0])
let gui

const mode_selector = document.querySelector(".mode-selector")
for (const mode of Object.keys(modes)) {
	const option = document.createElement("option")
	option.value = mode
	option.textContent = mode
	option.className = "mode-selector-option"
	option.value == current_mode && (option.id = "selected")

	option.onclick = () => {
		gui.destroy()
		points.length = 0
		current_mode = mode

		for (const children of mode_selector.children) children.id = ""
		option.id = "selected"

		setup()
	}

	mode_selector.appendChild(option)
}

const format = navigator.gpu.getPreferredCanvasFormat()
const adapter = await navigator.gpu.requestAdapter()
const device = await adapter.requestDevice()
const queue = device.queue

const context = canvas.getContext("webgpu")
context.configure({ device, format, alphaMode: "premultiplied" })

let frame = () => { }

const setup = () => {
	gui = new GUI({ closeOnTop: true })
	gui.useLocalStorage = true
	gui.domElement.style.userSelect = "none"
	set_storage("current_mode", current_mode)

	frame = modes[current_mode]({
		canvas,
		context,
		device,
		queue,
		format,
		points,
		gui,
	})
}; setup()

const render = (time) => {
	frame(time)
	set_storage("points", points)
	requestAnimationFrame(render)
}; render()