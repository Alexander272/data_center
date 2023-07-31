import { ISecure } from '@/types/graph'
import { Box, Grid, Typography } from '@mui/material'
import { Down, Up } from './secure.style'

const calendarData = () => {
	const d = new Date()

	const y = d.getFullYear()
	const m = d.getMonth()

	const firstDayOfMonth = new Date(y, m, 7).getDay()
	const lastDateOfMonth = new Date(y, m + 1, 0).getDate()
	// const lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

	// console.log(firstDayOfMonth)
	// console.log(lastDateOfMonth)
	// console.log(lastDayOfLastMonth)

	const data: ISecure[] = []

	for (let i = 1; i <= lastDateOfMonth; i++) {
		const group1 = Math.random()
		const group2 = Math.random()

		data.push({
			day: i,
			group: [
				{ number: '1', status: group1 < 0.8 ? 'good' : 'bad' },
				{ number: '2', status: group2 < 0.8 ? 'good' : 'bad' },
			],
		})
	}

	// console.log(data)

	return { skip: firstDayOfMonth, data }
}

export default function Secure() {
	const { skip, data } = calendarData()

	return (
		<Box>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Безопасность
			</Typography>
			<Grid container columns={7} sx={{ backgroundColor: 'var(--gray-border)' }} width={'400px'}>
				<Grid item xs={skip} />
				{data.map(d => (
					<Grid
						key={d.day}
						item
						xs={1}
						textAlign={'center'}
						position={'relative'}
						padding={2}
						sx={{ backgroundColor: '#fff', border: '1px solid var(--blue-border)' }}
					>
						<Up status={d.group[0].status} />
						<Typography position={'relative'} zIndex={5}>
							{d.day}
						</Typography>
						<Down status={d.group[1].status} />
					</Grid>
				))}
			</Grid>
		</Box>
	)
}
