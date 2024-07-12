import { gen_mips } from "./mip"

export const blended_mipmap = () => {
	const R = [255, 0, 0, 255]
	const Y = [255, 231, 0, 255]
	const G = [58, 181, 75, 255]
	const B = [0, 28, 116, 255]
	const C = [38, 123, 167, 255]
	const W = [255, 255, 255, 255]

	const texture = new Uint8Array([
		W, R, R, R, R, R, R, C, C, R, R, R, R, R, R, W,
		W, W, R, R, R, R, R, C, C, R, R, R, R, R, W, W,
		W, W, W, R, R, R, R, C, C, R, R, R, R, W, W, W,
		W, W, W, W, R, R, R, C, C, R, R, R, W, W, W, W,
		W, W, W, W, W, R, R, C, C, R, R, W, W, W, W, W,
		W, W, W, W, W, W, R, C, C, R, W, W, W, W, W, W,
		W, W, W, W, W, W, W, C, C, W, W, W, W, W, W, W,
		B, B, B, B, B, B, B, B, C, Y, Y, Y, Y, Y, Y, Y,
		B, B, B, B, B, B, B, G, Y, Y, Y, Y, Y, Y, Y, Y,
		W, W, W, W, W, W, W, G, G, W, W, W, W, W, W, W,
		W, W, W, W, W, W, R, G, G, R, W, W, W, W, W, W,
		W, W, W, W, W, R, R, G, G, R, R, W, W, W, W, W,
		W, W, W, W, R, R, R, G, G, R, R, R, W, W, W, W,
		W, W, W, R, R, R, R, G, G, R, R, R, R, W, W, W,
		W, W, R, R, R, R, R, G, G, R, R, R, R, R, W, W,
		W, R, R, R, R, R, R, G, G, R, R, R, R, R, R, W,
	].flat())

	return gen_mips(texture, 16)
}

export const checked_mipmap = () => {
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
		ctx.fillStyle = i & 1 ? '#000' : '#fff'
		ctx.fillRect(0, 0, size, size)
		ctx.fillStyle = color
		ctx.fillRect(0, 0, size / 2, size / 2)
		ctx.fillRect(size / 2, size / 2, size / 2, size / 2)
		return ctx.getImageData(0, 0, size, size)
	})
}

export const texture_with_mips = (mips, device) => {
	const texture = device.createTexture({
		size: [mips[0].width, mips[0].height],
		mipLevelCount: mips.length,
		format: 'rgba8unorm',
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	})
	mips.forEach(({ data, width, height }, mipLevel) => {
		device.queue.writeTexture(
			{ texture, mipLevel },
			data,
			{ bytesPerRow: width * 4 },
			{ width, height },
		)
	})
	return texture
}