import shader from "../shaders/rainbow.wgsl?raw"

export default (props) => {
	const { canvas, context, device, format, gui } = props

	const module = device.createShaderModule({ code: shader })

	const pipeline = device.createRenderPipeline({
		layout: 'auto',
		vertex: { module },
		fragment: { module, targets: [{ format }] },
	})

	return () => {
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
	}
}

// make it scroll?