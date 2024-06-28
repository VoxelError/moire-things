import React, { useEffect, useState } from 'react'
import ModeSelect from './ModeSelect.jsx'
import PauseButton from './PauseButton.jsx'
import PlotButton from './PlotButton.jsx'
import ResetButton from './ResetButton.jsx'
import styled from 'styled-components'
import { drawing_mode, set_drawing_mode } from '../util/controls.js'

const Menu = styled.div`
	padding: 16px;
	position: fixed;
	top: 0;
	right: 0;
	display: flex;
	gap: 16px;
`

export default ({ size, reset_count, reset_points, reset_canvas }) => {
	const [current_mode, set_mode] = useState(drawing_mode)

	useEffect(() => {
		reset_canvas()
	}, [current_mode])

	return (
		<Menu>
			<PauseButton mode={current_mode} />
			<ResetButton
				reset_count={reset_count}
				reset_points={reset_points}
				reset_canvas={reset_canvas}
			/>
			<PlotButton mode={current_mode} size={size} />
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