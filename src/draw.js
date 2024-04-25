export const stroke_line = (context, { start, end, width, stroke, cap }) => {
	context.beginPath()
	context.moveTo(start[0], start[1])
	context.lineTo(end[0], end[1])
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.lineCap = cap ?? "butt"
	context.stroke()
}

export const stroke_arc = (context, { center, radius, width, stroke }) => {
	context.beginPath()
	context.arc(
		center[0],
		center[1],
		radius,
		0,
		2 * Math.PI
	)
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.stroke()
}

export const fill_arc = (context, { center, radius, fill }) => {
	context.beginPath()
	context.arc(
		center[0],
		center[1],
		radius,
		0,
		2 * Math.PI
	)
	context.fillStyle = fill ?? "white"
	context.fill()
}