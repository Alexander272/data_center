import styled from '@emotion/styled'

type DayProps = {
	complete?: boolean
	active?: boolean
}
export const Day = styled.div<DayProps>`
	/* width: 48px; */
	/* width: 80px; */
	/* width: 82px; */
	/* height: 64px; */
	width: 52px;
	height: 48px;
	/* padding: 12px; */
	border-radius: 8px;
	display: flex;
	/* align-items: center; */
	/* justify-content: center; */
	transition: all 0.3s ease-in-out;
	cursor: pointer;
	background-color: #fff;
	font-size: 1.3rem;
	position: relative;
	flex-direction: column;

	// border
	border: 2px solid var(--gray-border);
	border-color: ${props => props.complete && 'var(--success-border)'};
	border-color: ${props => props.active && 'var(--blue-border)'};

	// color
	/* color: var(--gray-color); */
	color: ${props => props.complete && 'var(--success)'};
	color: ${props => props.active && 'var(--blue)'};

	&:hover {
		background-color: #e1effe;
	}
`
