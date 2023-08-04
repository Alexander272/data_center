import styled from '@emotion/styled'

export const Container = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 16px;
	/* margin-top: 40px; */
	max-width: 1580px;
	/* align-self: center; */
	margin: 40px auto;
`

type GroupProps = {
	active?: boolean
}
export const Group = styled.div<GroupProps>`
	max-width: 300px;
	width: 100%;
	padding: 10px 16px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	transition: all 0.3s ease-in-out;
	cursor: pointer;
	background-color: #fff;

	// border
	border: 2px solid var(--gray-border);
	border-color: ${props => props.active && 'var(--blue-border)'};

	// color
	color: ${props => props.active && 'var(--blue)'};

	&:hover {
		background-color: #e1effe;
	}
`
