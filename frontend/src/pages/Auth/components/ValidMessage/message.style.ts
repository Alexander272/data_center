import styled from '@emotion/styled'

export const Message = styled.div`
	opacity: 0;
	visibility: hidden;
	background-color: var(--white);
	/* margin-top: 20px; */
	position: absolute;
	right: 0;
	top: 100%;
	margin-top: 5px;
	padding: 6px 12px;
	border-radius: 12px;
	z-index: 10;
	transition: all 0.4s ease-in-out;
`

type IconProps = {
	right?: string
}
export const Icon = styled.div<IconProps>`
	position: absolute;
	top: 50%;
	right: ${props => (props.right ? props.right : '15px')};
	height: 24px;
	width: 24px;
	transform: translateY(-50%);
	cursor: pointer;

	&:hover {
		& + ${Message} {
			opacity: 1;
			visibility: visible;
		}
	}
`

export const List = styled.ul`
	margin: 0;
	padding-inline-start: 20px;
	list-style-type: circle;
`

export const Item = styled.li``
