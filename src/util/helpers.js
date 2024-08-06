import { listen } from "./controls"

export const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
export const get_storage = (name, fallback) => {
	const check = localStorage.getItem(name)
	return check ? JSON.parse(check) : fallback
}

export const bind_entries = (entries) => entries.map((resource, binding) => ({ binding, resource }))

export const render_pass = (encoder, context, clearValue) => {
	return encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue,
			loadOp: "clear",
			storeOp: "store",
		}]
	})
}

export const setup = async (append = true, listening = true) => {
	const canvas = document.createElement('canvas')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	append && document.body.append(canvas)
	listening && listen(canvas)

	const adapter = await navigator.gpu.requestAdapter()
	const device = await adapter?.requestDevice()
	const format = navigator.gpu.getPreferredCanvasFormat()

	if (device == undefined) {
		alert("Your browser does not support WebGPU")
	}

	const context = canvas.getContext('webgpu')

	device && context && context.configure({ device, format })

	return { canvas, context, adapter, device, format }
}

export class GPUContext {
	constructor(canvas, options) {
		this.context = canvas.getContext('webgpu')
		this.context.configure(options)
		return this.context
	}
}