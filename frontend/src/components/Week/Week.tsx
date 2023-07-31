import { Stack } from '@mui/material'
import { Day } from './week.style.'

export const Week = () => {
	const day = new Date().getDate()

	const renderDays = () => {
		const days: JSX.Element[] = []

		for (let i = 6; i >= 0; i--) {
			days.push(
				<Day active={i == 0} complete={i > 1}>
					{day - i}
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
