import "./styles.scss"
import modes from "./util/modes.js"
import { listen } from "./util/controls.js"
import { GUI } from "dat.gui"
import { get_storage, set_storage } from "./util/helpers.js"

!navigator.gpu && alert("Your browser does not support WebGPU")

const canvas = document.getElementById("webgpu_canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
listen(canvas)

const settings = { mode: get_storage("mode", Object.keys(modes)[4]) }
let gui

const render = async () => {
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

	const handle = modes[settings.mode]({
		canvas,
		context,
		device,
		queue,
		format,
		gui,
	})

	gui.add(settings, "mode", Object.keys(modes)).onChange(() => {
		cancelAnimationFrame(handle)
		device.destroy()
		gui.destroy()
		render()
	})
}; render()

// to-do: clear points on mode select