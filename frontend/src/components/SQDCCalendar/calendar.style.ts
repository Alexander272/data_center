import styled from '@emotion/styled'

type CellProps = {
	status?: 'bad' | 'good' | 'middle'
}
export const Cell = styled.div<CellProps>`
	/* position: absolute; */
	/* left: 0; */
	width: 100%;
	/* height: 50%; */
	background-color: ${props => props.status == 'bad' && '#ff333373'};
	background-color: ${props => props.status == 'good' && '#32f92494'};

	/* display: flex; */
	flex-grow: 1;
`

export const Up = styled(Cell)`
	top: 0;
`

export const Down = styled(Cell)`
	top: 50%;
`
