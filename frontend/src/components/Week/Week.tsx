import { MouseEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckOutlined'
import HourglassIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { setDate } from '@/store/criterions'
import { useGetCompletedPeriodQuery } from '@/store/api/criterions'
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

	const { data: completedDays } = useGetCompletedPeriodQuery({ type: 'day', date: FormatDate(lastDate) })

	const changeDateHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { date } = (event.target as HTMLDivElement).dataset
		if (!date) return
		dispatch(setDate(date))
	}

	//TODO переписать с использованием dayjs
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

			let complete = false
			const cDay = completedDays?.data?.find(d => d.date == formatDate)
			if (cDay && cDay.complete) complete = true

			days.push(
				<Day
					key={i}
					active={formatDate == date}
					complete={complete}
					data-date={formatDate}
					onClick={changeDateHandler}
				>
					<Typography fontSize={'inherit'} pl={1} sx={{ pointerEvents: 'none' }}>
						{/* {day - i > 0 ? day - i : lastDay + day - i} */}
						{/* {formatDate.replace('.2023', '')} */}
						{formatDate.split('.')[0]}
					</Typography>

					<Box position={'absolute'} right={2} bottom={6} height={'18px'} sx={{ pointerEvents: 'none' }}>
						{complete && <CheckIcon sx={{ fontSize: '18px' }} />}
						{!complete && <HourglassIcon sx={{ fontSize: '18px', color: '#adadad' }} />}
					</Box>
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
