import styled from '@emotion/styled'

export const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	pointer-events: none;
`

export const Password = styled.p`
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
	background-color: #fff;
	width: 100%;
	margin-left: 14px;
	transition: all 0.3s ease-in-out;
`

export const Icon = styled.div`
	margin: auto;
	margin-right: 15px;
	height: 24px;
	width: 24px;
	cursor: pointer;
	pointer-events: all;
	order: 1;

	&:hover + ${Password} {
		opacity: 1;
		visibility: visible;
	}
`
