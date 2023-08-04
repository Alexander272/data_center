import { Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { Cell } from './calendar.style'

const getSkippedDays = () => {
	const d = new Date()

	const y = d.getFullYear()
	const m = d.getMonth()

	const firstDayOfMonth = new Date(y, m, 7).getDay()
	const lastDateOfMonth = new Date(y, m + 1, 0).getDate()
	// const lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

	// console.log(firstDayOfMonth)
	// console.log(lastDateOfMonth)
	// console.log(lastDayOfLastMonth)

	// console.log(data)

	return { skip: firstDayOfMonth, daysCount: lastDateOfMonth }
}

interface Data {
	day: string
	status: ('good' | 'bad' | 'middle')[]
}

type Props = {
	data: Data[]
}

export const Calendar: FC<Props> = ({ data }) => {
	const { skip, daysCount } = getSkippedDays()

	const renderTable = () => {
		const days: JSX.Element[] = []
		let status: ('good' | 'bad' | 'middle')[] = []

		let index = 0
		for (let i = 1; i <= daysCount; i++) {
			if (index < data.length && data[index].day == i.toString()) {
				status = data[index].status
				index++
			} else {
				status = []
			}

			days.push(
				<Grid
					key={i}
					item
					xs={1}
					position={'relative'}
					width={'58px'}
					height={'58px'}
					sx={{
						backgroundColor: '#fff',
						border: '1px solid var(--blue-border)',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography
						position={'relative'}
						zIndex={5}
						sx={{
							fontWeight: i == new Date().getDate() ? 'bold' : 'normal',
							fontSize: i == new Date().getDate() ? '1.3rem' : '1rem',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					>
						{i}
					</Typography>

					{status.map((s, i) => (
						<Cell key={s + i.toString()} status={s} />
					))}
				</Grid>
			)
		}

		return days
	}

	return (
		<Grid container columns={7} sx={{ backgroundColor: 'var(--gray-border)' }}>
			<Grid item xs={skip} />
			{renderTable()}
		</Grid>
	)
}
