import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const Container = styled.header`
	user-select: none;
	display: flex;
	justify-content: center;
	padding: 10px;
	margin-bottom: -100px;
	position: relative;
	z-index: 3;
`

export const Logo = styled.img`
	width: auto;
	height: 65px;
`

export const LogoLink = styled(Link)`
	text-decoration: none;
	display: flex;
	align-items: center;
	color: var(--primary-color);
	font-size: 2.4rem;

	span {
		margin-left: 3px;
	}

	@media screen and (max-width: 500px) {
		flex-basis: 100%;
		justify-content: center;
		margin-bottom: 10px;
	}
`
