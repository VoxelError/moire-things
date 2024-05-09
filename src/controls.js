let draw_mode

document.addEventListener("keydown", (e) => {
	for (let i = 0; i < 10; i++) {
		if (e.code == `Digit${i}`) {
			draw_mode = i
			localStorage.setItem("draw_mode", JSON.stringify(draw_mode))
		}
	}
})

export const get_draw_mode = () => JSON.parse(localStorage.getItem("draw_mode")) ?? 0