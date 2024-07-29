export const cursor = {
	x: 0,
	y: 0,
	show: true,
}

export const listen = (canvas) => {
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