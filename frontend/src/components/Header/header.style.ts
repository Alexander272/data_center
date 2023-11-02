import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const Container = styled.header`
	width: 100%;
	background: #fff;
	box-shadow: 0 0 3px #0000004f;
	margin-bottom: 20px;
	user-select: none;
	min-height: 60px;
	display: flex;
	/* align-items: center; */
	justify-content: center;
	padding: 0 10px;
`

export const Content = styled.div`
	display: flex;
	padding: 5px 10px;
	max-width: 1580px;
	margin: 0 auto;
	flex-wrap: wrap;
	gap: 10px;
`

export const NavLink = styled(Link)`
	text-decoration: none;
	font-size: 1.2rem;
	color: var(--primary-color);
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		bottom: 0px;
		height: 2px;
		width: 100%;
		max-width: 0%;
		background-color: var(--primary-color);
		transition: all 0.3s ease-in-out;
	}

	&:hover {
		&:after {
			max-width: 100%;
		}
	}
`

export const NavButton = styled.p`
	cursor: pointer;
	font-size: 1.2rem;
	color: var(--primary-color);
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		bottom: 0px;
		height: 2px;
		width: 100%;
		max-width: 0%;
		background-color: var(--primary-color);
		transition: all 0.3s ease-in-out;
	}

	&:hover {
		&:after {
			max-width: 100%;
		}
	}
`
