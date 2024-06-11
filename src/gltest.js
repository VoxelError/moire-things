import { rng } from './lib/math'
import './styles.scss'

const canvas = document.getElementById("game_canvas")
const gl = canvas.getContext("webgl2")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
gl.viewport(0, 0, canvas.width, canvas.height)

const init_shader_program = () => {
	const shaderProgram = gl.createProgram()
	gl.attachShader(shaderProgram, load_shader(gl.VERTEX_SHADER, `
		attribute vec4 aVertexPosition;
		void main(void) {
			gl_Position = aVertexPosition;
		}
	`))
	gl.attachShader(shaderProgram, load_shader(gl.FRAGMENT_SHADER, `
		precision mediump float;
		uniform vec4 uColor;
		void main(void) {
			gl_FragColor = uColor;
		}
	`))
	gl.linkProgram(shaderProgram)

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
		return null
	}

	return shaderProgram
}

const load_shader = (type, source) => {
	const shader = gl.createShader(type)
	
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	return shader
}

const shader_program = init_shader_program()

const program_info = {
	program: shader_program,
	attribLocations: {
		vertexPosition: gl.getAttribLocation(shader_program, 'aVertexPosition'),
	},
	uniformLocations: {
		color: gl.getUniformLocation(shader_program, 'uColor'),
	},
}

const init_buffers = () => {
	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	const positions = [
		-0.5, rng(1),
		0.5, 0.5,
		-0.5, -0.5,
		0.5, -0.5,
	]

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	return {
		position: positionBuffer,
	}
}

const buffers = init_buffers()

!function drawScene() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.useProgram(program_info.program)

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
	gl.vertexAttribPointer(
		program_info.attribLocations.vertexPosition,
		2,
		gl.FLOAT,
		false,
		0,
		0)
	gl.enableVertexAttribArray(program_info.attribLocations.vertexPosition)

	// Set the color to white
	gl.uniform4f(program_info.uniformLocations.color, 1.0, 1.0, 1.0, 1.0)

	// Draw the rectangle
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}()