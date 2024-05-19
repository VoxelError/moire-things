import { drawing_mode } from "../lib/controls"

const dropdown = document.getElementById("drawing_mode")

const modes = [
	"Bounce",
	"Circles",
	"Eyes",
	"Fins",
	// "Gravity",
	"Heart",
	"Larva",
	"Legs",
	"Orbs",
	"Pendulums",
	// "Pointer",
	"Snake",
	// "Speed",
	"Sphere",
	"Spin",
	"Squares",
	// "Stereo",
	"Sun",
	"Twirls",
]

modes.forEach((mode) => {
	dropdown.innerHTML += `<option value="${mode}" ${mode == drawing_mode && "selected"}>${mode}</option>`
})