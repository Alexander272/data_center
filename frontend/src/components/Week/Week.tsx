import { MouseEvent } from 'react'
import { Stack } from '@mui/material'
import { setDate } from '@/store/criterions'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { FormatDate } from '@/utils/date'
import { Day } from './week.style'

export const Week = () => {
	const d = new Date()

	const y = d.getFullYear()
	const m = d.getMonth()

	const day = d.getDate()
	const lastDate = m == 0 ? new Date(y - 1, 11, 0) : new Date(y, m, 0)
	const lastDay = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

	const date = useAppSelector(state => state.criterions.date)
	const dispatch = useAppDispatch()

	const changeDateHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { date } = (event.target as HTMLDivElement).dataset
		if (!date) return
		dispatch(setDate(date))
	}

	const renderDays = () => {
		const days: JSX.Element[] = []

		for (let i = 6; i >= 0; i--) {
			let dayDate: Date
			if (day - i > 0) {
				dayDate = new Date(d.setDate(day - i))
			} else {
				dayDate = new Date(lastDate.setDate(lastDay + day - i))
			}
			const formatDate = FormatDate(dayDate)

			days.push(
				<Day
					key={i}
					active={formatDate == date}
					complete={i > 1}
					data-date={formatDate}
					onClick={changeDateHandler}
				>
					{day - i > 0 ? day - i : lastDay + day - i}
				</Day>
			)

			if (date == '' && i == 0) dispatch(setDate(formatDate))
		}

		return days
	}

	return (
		<Stack width={'100%'} direction={'row'} spacing={1} mb={2} justifyContent={'center'}>
			{renderDays()}
		</Stack>
	)
}
