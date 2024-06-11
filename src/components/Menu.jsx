import React, { useEffect, useState } from 'react'
import ModeSelect from './ModeSelect.jsx'
import PauseButton from './PauseButton.jsx'
import PlotButton from './PlotButton.jsx'
import ResetButton from './ResetButton.jsx'
import styled from 'styled-components'
import { reset_canvas } from '../drawings/_main.js'
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
	// const [is_paused, set_pause] = useState(window.pause)

	useEffect(() => {
		window.pause = false
		reset_canvas()
	}, [current_mode])

	const handle_change = (mode) => {
		set_mode(mode)
		set_drawing_mode(mode)
	}

	return (
		<Menu>
			<PauseButton mode={current_mode} />
			<ResetButton />
			<PlotButton mode={current_mode} />
			<ModeSelect
				mode={current_mode}
				handle_change={handle_change}
			/>
		</Menu>
	)
}