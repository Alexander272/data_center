import styled from '@emotion/styled'

type Props = {
	width?: string
}
export const Container = styled.div<Props>`
	width: 100%;
	max-width: ${props => (props.width ? props.width : '100%')};
	display: flex;
	flex-direction: column;
	gap: 10px;
`

type StepProps = {
	complete?: boolean
	active?: boolean
}
export const StepContainer = styled.div<StepProps>`
	width: 100%;
	padding: 10px 16px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	gap: 10px;
	transition: all 0.3s ease-in-out;
	cursor: pointer;
	background-color: #fff;

	position: relative;

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

export const Icon = styled.div`
	pointer-events: none;
	width: 24px;
	height: 24px;
	margin-left: auto;

	position: absolute;
	right: 16px;
`
