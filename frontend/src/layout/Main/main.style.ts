import styled from '@emotion/styled'

export const Base = styled.div`
	min-height: 100vh;
	/* height: 100%; */
	display: flex;
	flex-direction: column;
	background: var(--main-bg);

	/* ::-webkit-scrollbar,
	::-webkit-scrollbar-corner {
		background: rgba(186, 193, 205, 0.2);
		idth: 1rem !important;
		height: 1rem !important;
	}
	::-webkit-scrollbar-thumb {
		border-width: 0.25rem;
		border-style: solid;
		border-color: transparent;
		border-image: initial;
		border-radius: 0.5rem;
		background: content-box rgba(186, 193, 205, 0.7) !important;
	} */
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
