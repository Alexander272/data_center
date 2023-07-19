import styled from '@emotion/styled'

export const Container = styled.div`
	flex-grow: 1;
	padding: 20px 30px;
	border-radius: 8px;
	background-color: #fff;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	/* border: 1px solid var(--blue-border); */
	/* box-shadow: 0px 0px 4px 0px #2626262b; */
`

export const Table = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: auto;

	& div,
	& table {
		width: 100%;
	}

	& tr > th:first-of-type {
		width: 10%;
	}
`
