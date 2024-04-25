const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const { sin, cos, abs, sqrt } = Math
const to_radians = (num) => (num * Math.PI) / 180

let actor = {
	x: width / 2,
	y: height / 2,
	r: 30,
	a: to_radians(90),
	x_thrust: 0,
	y_thrust: 0,
}

const calc_speed = () => (abs(actor.x_thrust) + abs(actor.y_thrust))

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
	keybinds.ArrowRight && (actor.a -= to_radians(5))
	keybinds.ArrowLeft && (actor.a += to_radians(5))

	if (keybinds.ArrowUp) {
		actor.x_thrust += cos(actor.a) * 0.2
		actor.y_thrust -= sin(actor.a) * 0.2
	} else {
		actor.x_thrust *= keybinds.ArrowDown ? 0.96 : 0.99
		actor.y_thrust *= keybinds.ArrowDown ? 0.96 : 0.99
	}
}

const move_actor = () => {
	actor.x += actor.x_thrust
	actor.y += actor.y_thrust

	actor.r

	actor.x < -actor.r && (actor.x = width + actor.r)
	actor.y < -actor.r && (actor.y = height + actor.r)
	actor.x > width + actor.r && (actor.x = -actor.r)
	actor.y > height + actor.r && (actor.y = -actor.r)
}

const draw_actor = () => {
	const { x, y, r, a } = actor
	context.beginPath()
	context.arc(x, y, r + calc_speed(), 0, to_radians(360))
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

const draw = () => {
	context.clearRect(0, 0, width, height)

	controls()
	move_actor()
	draw_pendulum()

	requestAnimationFrame(draw)
}

draw()