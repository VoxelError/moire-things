export const cursor = {
	x: 0,
	y: 0,
	r: 0,
	delta: 0,
	held: false,
	show: true,
	size: 66,
	left_click: () => { },
	right_click: () => { },
}

export const listen = (canvas) => {
	canvas.addEventListener("mousedown", (event) => {
		event.button == 0 && (cursor.held = true)

		event.button == 0 && cursor.left_click()
		event.button == 2 && cursor.right_click()

		cursor.left_click = () => { }
		cursor.right_click = () => { }
	})
	canvas.addEventListener("mouseup", () => cursor.held = false)
	canvas.addEventListener("mousemove", (event) => {
		cursor.x = event.offsetX
		cursor.y = event.offsetY
	})
	canvas.addEventListener("mouseover", () => cursor.show = true)
	canvas.addEventListener("mouseleave", () => {
		cursor.held = false
		cursor.show = false
	})
	canvas.addEventListener("wheel", (event) => {
		// 	e.preventDefault()
		// 	cursor.size += e.deltaY * 0.1
	})
	canvas.addEventListener("contextmenu", (event) => event.preventDefault())
}

const fade = (context, value, size) => {
	const image_data = context.getImageData(0, 0, size.x, size.y)
	const pixels = image_data.data
	for (let i = 0; i < pixels.length; i += 4) {
		// for (let j = 0; j < 3; j++) { pixels[i + j] = 255 - pixels[i + j] }
		pixels[i + 3] -= value
	}
	context.putImageData(image_data, 0, 0)
}