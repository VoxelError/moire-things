export const cursor = {
	x: 0,
	y: 0,
	show: true,
	left_held: false,
	right_held: false,
	left_click: () => { },
	right_click: () => { },
	left_release: () => { },
	right_release: () => { },
}

export const listen = (canvas) => {
	canvas.addEventListener("mousemove", (event) => {
		// cursor.x = event.offsetX
		// cursor.y = event.offsetY

		cursor.x = (event.offsetX / canvas.width) * 2 - 1
		cursor.y = -((event.offsetY / canvas.height) * 2 - 1)
	})

	canvas.addEventListener("mousedown", (event) => {
		event.button == 0 && (cursor.left_held = true)
		event.button == 2 && (cursor.right_held = true)

		event.button == 0 && cursor.left_click()
		event.button == 2 && cursor.right_click()

		cursor.left_click = () => { }
		cursor.right_click = () => { }
	})
	canvas.addEventListener("mouseup", (event) => {
		cursor.left_held = false
		cursor.right_held = false

		event.button == 0 && cursor.left_release()
		event.button == 2 && cursor.right_release()

		cursor.left_release = () => { }
		cursor.right_release = () => { }
	})

	canvas.addEventListener("mouseover", () => {
		cursor.show = true
	})
	canvas.addEventListener("mouseleave", () => {
		cursor.left_held = false
		cursor.right_held = false
		cursor.show = false
	})

	canvas.addEventListener("wheel", (event) => {
		// 	e.preventDefault()
		// 	cursor.size += e.deltaY * 0.1
	})
	canvas.addEventListener("contextmenu", (event) => event.preventDefault())
}