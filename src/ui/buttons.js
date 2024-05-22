import { reset_count, reset_points } from "../drawings/_main"
import { plot_points } from "../lib/controls"

const plot_button = document.getElementById("plot_button")
plot_button.addEventListener("click", () => plot_points())

const reset_button = document.getElementById("reset_button")
reset_button.addEventListener("click", () => {
	reset_count()
	reset_points()
})