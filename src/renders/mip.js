const mip_next = ({ data, width, height }) => {
	const dest_width = Math.max(1, width / 2 | 0)
	const dest_height = Math.max(1, height / 2 | 0)
	const dest = new Uint8Array(dest_width * dest_height * 4)

	const get_pixel = (x, y) => {
		const offset = (x + y * width) * 4
		return data.subarray(offset, offset + 4)
	}

	for (let y = 0; y < dest_height; ++y) {
		for (let x = 0; x < dest_width; ++x) {
			const au = width * (x + 0.5) / dest_width - 0.5
			const av = height * (y + 0.5) / dest_height - 0.5

			const tx = au | 0
			const ty = av | 0

			const mix = (a, b, t) => (
				a.map((v, i) =>
					v + (b[i] - v) * t
				)
			)

			dest.set(
				mix(
					mix(
						get_pixel(tx, ty),
						get_pixel(tx + 1, ty),
						au % 1
					),
					mix(
						get_pixel(tx, ty + 1),
						get_pixel(tx + 1, ty + 1),
						av % 1
					),
					av % 1
				),
				(x + y * dest_width) * 4
			)
		}
	}
	return {
		data: dest,
		width: dest_width,
		height: dest_height,
	}
}

export const gen_mips = (array, width) => {
	let mip = {
		data: array,
		width,
		height: 0.25 * array.length / width,
	}

	const mips = [mip]

	while (mip.width > 1 || mip.height > 1) {
		mip = mip_next(mip)
		mips.push(mip)
	}

	return mips
}