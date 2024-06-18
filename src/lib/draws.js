import { pi, tau } from "./math"

export const stroke_line = (context, params) => {
	const { start, end, width, dash, offset, stroke, cap, alpha } = params

	context.beginPath()
	context.moveTo(start[0], start[1])
	context.lineTo(end[0], end[1])
	context.lineWidth = width ?? 1
	context.setLineDash(dash ?? [])
	context.lineDashOffset = offset ?? 0
	context.strokeStyle = stroke ?? "white"
	context.lineCap = cap ?? "butt"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

// export const draw_text = (context, { fill, font, alpha, content, pos }) => {
// 	context.fillStyle = "white"
// 	context.font = "30px Arial"
// 	context.globalAlpha = 0.1
// 	context.fillText(content, pos[0], pos[1])
// }

export const draw_arc = (context, { center, radius, fill, stroke }) => {
	context.beginPath()
	context.arc(
		center[0],
		center[1],
		radius,
		0,
		2 * pi
	)

	if (fill) {
		const { alpha, style } = fill

		context.globalAlpha = alpha ?? 1
		context.fillStyle = style ?? "white"
		context.fill()
	}

	if (stroke) {
		const { dash, offset, width, alpha, style } = stroke

		context.setLineDash(dash ?? [])
		context.lineDashOffset = offset ?? 0
		context.lineWidth = width ?? 1
		context.globalAlpha = alpha ?? 1
		context.strokeStyle = style ?? "white"
		context.stroke()
	}
}

export const stroke_arc = (context, { center, radius, width, stroke, alpha }) => {
	context.beginPath()
	context.arc(
		center[0],
		center[1],
		radius,
		0,
		2 * pi
	)
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

export const stroke_ellipse = (context, { center, radii, rotation, arc = [0, tau], width, stroke, alpha }) => {
	context.beginPath()
	context.ellipse(
		center[0],
		center[1],
		radii[0],
		radii[1],
		rotation ?? 0,
		arc[0],
		arc[1]
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

export const stroke_rect = (context, { start, dims, width, stroke, alpha }) => {
	context.beginPath()
	context.rect(
		start[0],
		start[1],
		dims[0],
		dims[1],
	)
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

export const stroke_curve1 = (context, { start, end, control, width, stroke, cap, alpha }) => {
	context.beginPath()
	context.moveTo(start[0], start[1])
	context.quadraticCurveTo(control[0], control[1], end[0], end[1])
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.lineCap = cap ?? "butt"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}

export const stroke_curve2 = (context, { start, end, control, width, stroke, cap, alpha }) => {
	context.beginPath()
	context.moveTo(start[0], start[1])
	context.bezierCurveTo(control[0], control[1], control[2], control[3], end[0], end[1])
	context.lineWidth = width ?? 1
	context.strokeStyle = stroke ?? "white"
	context.lineCap = cap ?? "butt"
	context.globalAlpha = alpha ?? 1
	context.stroke()
}