import { gen_mips } from "./mip"

export const texture_mipmap = (bitmap) => {
	const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
	context.putImageData(bitmap, 0, 0)
	return gen_mips(bitmap, bitmap.width)
}

export const array_mipmap = () => {
	const W = [0, 100, 100, 255]
	const G = [58, 181, 75, 255]
	const B = [0, 28, 116, 255]

	const pixels = new Uint8Array([
		W, B, B, B, B, B, B, B,
		G, W, G, G, G, G, G, B,
		G, B, W, B, B, B, G, B,
		G, B, G, W, G, B, G, B,
		G, B, G, B, W, B, G, B,
		G, B, G, G, G, W, G, B,
		G, B, B, B, B, B, W, B,
		G, G, G, G, G, G, G, W,
	].flat())

	return gen_mips(pixels, 8)
}

export const canvas_mipmap = () => {
	const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
	const levels = [
		{ size: 64, color: 'rgb(128,0,255)', },
		{ size: 32, color: 'rgb(0,255,0)', },
		{ size: 16, color: 'rgb(255,0,0)', },
		{ size: 8, color: 'rgb(255,255,0)', },
		{ size: 4, color: 'rgb(0,0,255)', },
		{ size: 2, color: 'rgb(0,255,255)', },
		{ size: 1, color: 'rgb(255,0,255)', },
	]
	return levels.map(({ size, color }, i) => {
		ctx.canvas.width = size
		ctx.canvas.height = size

		ctx.fillStyle = color
		ctx.fillRect(0, 0, size / 2, size / 2)
		ctx.translate(size / 2, size / 2)
		ctx.fillRect(0, 0, size / 2, size / 2)

		return ctx.getImageData(0, 0, size, size)
	})
}

export const mipmapped_texture = (mipmap, device) => {
	const texture = device.createTexture({
		size: [mipmap[0].width, mipmap[0].height],
		mipLevelCount: mipmap.length,
		format: 'rgba8unorm',
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	})
	mipmap.forEach(({ data, width, height }, mipLevel) => {
		device.queue.writeTexture(
			{ texture, mipLevel },
			data,
			{ bytesPerRow: width * 4 },
			{ width, height },
		)
	})
	return texture
}