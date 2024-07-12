import "../styles.scss"
import shader from "../shaders/rainbow.wgsl?raw"

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)

const adapter = await navigator.gpu?.requestAdapter()
const device = await adapter?.requestDevice()

const context = canvas.getContext('webgpu')
const format = navigator.gpu.getPreferredCanvasFormat()
context.configure({ device, format })

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: { module, targets: [{ format }] },
})

!function render() {
	const encoder = device.createCommandEncoder()

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0, 0, 0, 1],
			loadOp: "clear",
			storeOp: "store",
		}]
	})
	pass.setPipeline(pipeline)
	pass.draw(6)
	pass.end()

	device.queue.submit([encoder.finish()])
}()

// make it scroll?