import React, { useEffect, useState } from 'react'
import ModeSelect from './ModeSelect.jsx'
import PauseButton from './PauseButton.jsx'
import PlotButton from './PlotButton.jsx'
import ResetButton from './ResetButton.jsx'
import styled from 'styled-components'
import { reset_canvas, reset_count, reset_points } from '../App.jsx'
import { drawing_mode, set_drawing_mode } from '../lib/controls.js'

const Menu = styled.div`
	padding: 16px;
	position: fixed;
	top: 0;
	right: 0;
	display: flex;
	gap: 16px;
`

export default () => {
	const [current_mode, set_mode] = useState(drawing_mode)

	useEffect(() => {
		window.pause = false
		// reset_count()
		// reset_points()
		reset_canvas()
	}, [current_mode])

	return (
		<Menu>
			<PauseButton mode={current_mode} />
			<ResetButton />
			<PlotButton mode={current_mode} />
			<ModeSelect
				mode={current_mode}
				handle_change={(mode) => {
					set_mode(mode)
					set_drawing_mode(mode)
				}}
			/>
		</Menu>
	)
}