import React from 'react'
import ModeSelect from './ModeSelect.jsx'
import PauseButton from './PauseButton.jsx'
import PlotButton from './PlotButton.jsx'
import ResetButton from './ResetButton.jsx'
import styled from 'styled-components'

const Menu = styled.div`
	padding: 16px;
	position: fixed;
	top: 0;
	right: 0;
	display: flex;
	gap: 16px;
`

export default () => {
	return (
		<Menu>
			<PauseButton />
			<ResetButton />
			<PlotButton />
			<ModeSelect />
		</Menu>
	)
}