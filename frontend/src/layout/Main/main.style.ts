import styled from '@emotion/styled'

export const Base = styled.div`
	min-height: 100vh;
	/* height: 100%; */
	display: flex;
	flex-direction: column;
	background: var(--main-bg);
`

export const Wrapper = styled.div`
	padding: 0 6px;
	/* max-width: 1200px; */
	min-width: 320px;
	/* min-height: 600px; */
	flex-grow: 1;
	width: 100%;
	gap: 12px;
	display: flex;
	/* flex-direction: column; */
	/* user-select: none; */
	position: relative;
`
