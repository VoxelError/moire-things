import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import circles from './canvases/circles'
import pendulums from './canvases/pendulums'
import { get_draw_mode } from './controls'

// createRoot(document.getElementById('root')).render(
// 	<StrictMode>
// 		{/* <App /> */}
// 	</StrictMode>
// )

// document.getElementById("canvas_type").setAttribute("src", "./src/canvases/pendulum.js")

!function render() {
	pendulums()
	// circles()

	// switch (get_draw_mode()) {
	// case 1: pendulums(); break
	// case 2: draw_fins(); break
	// case 3: draw_orbs(); break
	// case 4: circles(); break
	// case 5: draw_eyes(); break
	// case 6: draw_spin(); break
	// case 7: draw_bounce(); break
	// case 8: draw_snake(); break
	// case 9: draw_squares(); break
	// case 0: draw_hyperclock(); break
	// }

	const count = JSON.parse(localStorage.getItem("count")) ?? 0
	localStorage.setItem("count", JSON.stringify(count + 1))
	requestAnimationFrame(render)
}()