import React, { useEffect, useRef } from "react"
import { draw_points, drawing_mode, listen } from "./util/controls.js"
import Menu from "./components/Menu.jsx"
import modes from "./util/modes.js"

let size
let reset = false
let count = JSON.parse(localStorage.getItem("count")) ?? 0
const points = JSON.parse(localStorage.getItem("points")) ?? []
window.pause = JSON.parse(localStorage.getItem("pause")) ?? false

export const add_point = (x, y, z = 0, w = 0) => points.push([x, y, z, w])

export default () => {
	const canvas_ref = useRef(null)

	useEffect(() => {
		const canvas = canvas_ref.current
		const context = canvas.getContext("2d")

		listen(canvas)

		const scale = 1
		size = {
			x: canvas.width = window.innerWidth * scale,
			y: canvas.height = window.innerHeight * scale,
		}

		const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))

		!function update() {
			!window.pause && count++
			set_storage("count", count)
			set_storage("points", points)
			set_storage("pause", window.pause)
			set_storage("drawing_mode", drawing_mode)
			draw_points()

			const no_erase = ["pillar", "stalks"]
			no_erase.includes(drawing_mode) || context.reset()

			reset && context.reset()
			reset = false

			modes(drawing_mode)(size, context, points, count)
			requestAnimationFrame(update)
		}()
	}, [])

	return (
		<>
			<canvas id="game_canvas" ref={canvas_ref}></canvas>
			<Menu
				size={size}
				reset_count={() => count = 0}
				reset_points={() => points.length = 0}
				reset_canvas={() => reset = true}
			/>
		</>
	)
}