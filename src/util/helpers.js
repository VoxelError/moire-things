import { listen } from "./controls"

export const hsl_to_rgb = (h, s, l) => {
	let r
	let g
	let b

	if (s == 0) {
		r = g = b = l
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [
		r,
		g,
		b,
	]
}

function rgb_to_hsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6
	}

	return [
		h * 100,
		s * 100,
		l * 100,
	]
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