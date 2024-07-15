import { degrees, rng, tau } from "../util/math"

const { sin, cos, hypot } = Math

let actor = {
	r: 100,
	a: rng(tau),
	x_thrust: 0,
	y_thrust: 0,
}

let keybinds = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
}

const key_listen = (key) => {
	document.addEventListener("keydown", ({ code }) => code == key && (keybinds[key] = true))
	document.addEventListener("keyup", ({ code }) => code == key && (keybinds[key] = false))
}

key_listen("ArrowUp")
key_listen("ArrowDown")
key_listen("ArrowRight")
key_listen("ArrowLeft")

const controls = () => {
	// keybinds.ArrowRight && (actor.a -= degrees(5))
	// keybinds.ArrowLeft && (actor.a += degrees(5))

	actor.x_thrust += cos(actor.a) * 0.2
	actor.y_thrust -= sin(actor.a) * 0.2

	// if (keybinds.ArrowUp) {
	// 	actor.x_thrust += cos(actor.a) * 0.2
	// 	actor.y_thrust -= sin(actor.a) * 0.2
	// } else {
	// 	actor.x_thrust *= keybinds.ArrowDown ? 0.96 : 0.99
	// 	actor.y_thrust *= keybinds.ArrowDown ? 0.96 : 0.99
	// }
}

const move_actor = (width, height) => {
	actor.x += actor.x_thrust
	actor.y += actor.y_thrust

	actor.r

	actor.x < -actor.r && (actor.x = width + actor.r)
	actor.y < -actor.r && (actor.y = height + actor.r)
	actor.x > width + actor.r && (actor.x = -actor.r)
	actor.y > height + actor.r && (actor.y = -actor.r)
}

export default (context, count, points, size) => {
	points[0] = {
		x: size.x,
		y: size.y,
		theta: 0,
		speed: true,
	}

	actor.x ??= size.x / 2
	actor.y ??= size.y / 2

	actor.a = rng(tau)

	controls()
	move_actor(size.x, size.y)

	const { x, y, r, a } = actor
	context.beginPath()
	context.arc(x, y, r + hypot(actor.x_thrust, actor.y_thrust), 0, degrees(360))
	context.moveTo(
		x - (r * sin(a)),
		y - (r * cos(a)),)
	context.lineTo(
		x + (r * cos(a)),
		y - (r * sin(a))
	)
	context.lineTo(
		x + (r * sin(a)),
		y + (r * cos(a)),
	)
	context.strokeStyle = "white"
	context.stroke()
}