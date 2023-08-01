import { Stack } from '@mui/material'
import { Day } from './week.style.'

export const Week = () => {
	const d = new Date()

	const y = d.getFullYear()
	const m = d.getMonth()

	const day = d.getDate()
	const lastDay = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

	const renderDays = () => {
		const days: JSX.Element[] = []

		for (let i = 6; i >= 0; i--) {
			days.push(
				<Day active={i == 0} complete={i > 1}>
					{day - i > 0 ? day - i : lastDay + day - i}
				</Day>
			)
		}

		return days
	}

	return (
		<Stack width={'100%'} direction={'row'} spacing={1} mb={2} justifyContent={'center'}>
			{renderDays()}
		</Stack>
	)
}
