export const stroke_line = (context, { start, end, width, stroke, cap, alpha }) => {
	context.beginPath()
	context.moveTo(start[0], start[1])
	context.lineTo(end[0], end[1])
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.lineCap = cap ?? "butt"
	context.globalAlpha = alpha ?? 1
	context.stroke()
	context.globalAlpha = 1
}

export const stroke_arc = (context, { center, radius, width, stroke, alpha }) => {
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
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

export const stroke_square = (context, { center, side, width, stroke, alpha }) => {
	context.beginPath()
	context.rect(
		center[0] - side / 2,
		center[1] - side / 2,
		side,
		side,
	)
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

export const fill_arc = (context, { center, radius, fill, alpha }) => {
	context.beginPath()
	context.arc(
		center[0],
		center[1],
		radius,
		0,
		2 * Math.PI
	)
	context.fillStyle = fill ?? "white"
	context.globalAlpha = alpha ?? 1
	context.fill()
}