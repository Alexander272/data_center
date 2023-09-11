import styled from '@emotion/styled'

export const Base = styled.div`
	min-height: 100vh;
	min-width: 320px;
	display: flex;
	flex-direction: column;
	background-color: var(--body-bg-color);
`

type ContainerProps = {
	signUp?: boolean
}

export const Container = styled.div<ContainerProps>`
	position: relative;
	z-index: 5;
	margin: 20px 0;
	border-radius: 16px;
	background-color: var(--theme-bg-color);
	box-shadow: 2px 2px 8px 0px #3636362b;
	width: 400px;
	overflow: hidden;
	height: ${props => (props.signUp ? '630px' : '300px')};
	transition: all 0.5s ease-in-out;

	@media (max-width: 420px) {
		width: 100%;
	}
`

export const Wrapper = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	position: relative;
	/* padding-top: 100px; */

	&::after,
	&::before,
	${Container}::before {
		content: '';
		position: absolute;
		border-radius: 16px;
		background-color: var(--secondary-color);
		box-shadow: 1px 1px 7px 0 var(--secondary-color);
	}

	&::after {
		left: -5%;
		top: -2%;
		width: 200px;
		height: 200px;
		transform: rotate(347deg);
	}

	&::before {
		right: -16%;
		top: 7%;
		height: 600px;
		width: 500px;
		transform: rotate(332deg);
	}

	@media (max-width: 800px) {
		&::before {
			top: 40%;
			height: 400px;
			width: 300px;
		}
	}
`
