export const cursor = {
	x: 0,
	y: 0,
	r: 0,
	delta: 0,
	held_left: false,
	held_right: false,
	show: true,
	size: 66,
	left_click: () => { },
	right_click: () => { },
	left_up: () => { },
	right_up: () => { },
}

export const listen = (canvas) => {
	canvas.addEventListener("mousedown", (event) => {
		event.button == 0 && (cursor.held_left = true)
		event.button == 2 && (cursor.held_right = true)

		event.button == 0 && cursor.left_click()
		event.button == 2 && cursor.right_click()

		cursor.left_click = () => { }
		cursor.right_click = () => { }
	})
	canvas.addEventListener("mouseup", (event) => {
		cursor.held_left = false
		cursor.held_right = false

		event.button == 0 && cursor.left_up()
		event.button == 2 && cursor.right_up()

		cursor.left_up = () => { }
		cursor.right_up = () => { }
	})
	canvas.addEventListener("mousemove", (event) => {
		cursor.x = event.offsetX
		cursor.y = event.offsetY
	})
	canvas.addEventListener("mouseover", () => cursor.show = true)
	canvas.addEventListener("mouseleave", () => {
		cursor.held_left = false
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