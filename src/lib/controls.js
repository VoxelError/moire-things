export let drawing_mode = JSON.parse(localStorage.getItem("draw_mode")) ?? 1

document.addEventListener("keydown", (event) => {
	for (let i = 0; i < 10; i++) {
		if (event.code == `Digit${i}`) {
			drawing_mode = i
		}
	}

	"QWERTYUIOP".split('').forEach((char, index) => {
		if (event.code == `Key${char}`) {
			drawing_mode = index + 10
		}
	})

	localStorage.setItem("draw_mode", JSON.stringify(drawing_mode))
})