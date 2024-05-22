import { drawing_mode } from "../lib/controls"

const dropdown = document.getElementById("drawing_mode")

const modes = [
	"Bounce",
	"Circles",
	"Fins",
	"Heart",
	"Larva",
	"Legs",
	"Orbs",
	"Pendulums",
	"Petals",
	"Snake",
	"Sphere",
	"Spin",
	"Squares",
	"Stare",
	"Sun",
	"Twirls",
]

modes.forEach((mode) => {
	dropdown.innerHTML += `<option value="${mode}" ${mode == drawing_mode && "selected"}>${mode}</option>`
})