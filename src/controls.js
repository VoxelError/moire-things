document.addEventListener("keydown", (e) => {
	for (let i = 0; i < 10; i++) {
		if (e.code == `Digit${i}`) {
			localStorage.setItem("draw_mode", JSON.stringify(i))
		}
	}

	if (e.code == "KeyM") {
		localStorage.setItem("draw_mode", JSON.stringify(101))
	}
})

export const get_draw_mode = () => JSON.parse(localStorage.getItem("draw_mode")) ?? 0