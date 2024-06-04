import { MouseEvent } from 'react'
import dayjs from 'dayjs'
import { Box, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckOutlined'
import HourglassIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { setDate } from '@/store/criterions'
import { useGetCompletedPeriodQuery } from '@/store/api/criterions'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Day } from './week.style'

const DaysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export const Week = () => {
	const curDate = dayjs().startOf('d')

	const date = useAppSelector(state => state.criterions.date)
	const dispatch = useAppDispatch()

	const { data: completedDays } = useGetCompletedPeriodQuery({
		type: 'day',
		date: curDate.subtract(6, 'd').format('DD.MM.YYYY'),
	})

	const changeDateHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { date } = (event.target as HTMLDivElement).dataset
		if (!date) return
		dispatch(setDate(date))
	}

	const renderDays = () => {
		const days: JSX.Element[] = []

		if (date == '') dispatch(setDate(curDate.format('DD.MM.YYYY')))

		for (let i = 6; i >= 0; i--) {
			const d = curDate.subtract(i, 'd')
			const formatDate = d.format('DD.MM.YYYY')

			let complete = false
			const cDay = completedDays?.data?.find(d => d.date == formatDate)
			if (cDay && cDay.complete) complete = true

			days.push(
				<Box key={formatDate}>
					<Typography fontSize={'1.1rem'} textAlign={'center'} sx={{ pointerEvents: 'none' }}>
						{DaysOfWeek[d.day()]}
					</Typography>

					<Day
						active={formatDate == date}
						complete={complete}
						data-date={formatDate}
						onClick={changeDateHandler}
					>
						<Typography fontSize={'inherit'} pl={1} sx={{ pointerEvents: 'none' }}>
							{d.format('DD')}
						</Typography>

						<Box position={'absolute'} right={2} bottom={6} height={'18px'} sx={{ pointerEvents: 'none' }}>
							{complete && <CheckIcon sx={{ fontSize: '18px' }} />}
							{!complete && <HourglassIcon sx={{ fontSize: '18px', color: '#adadad' }} />}
						</Box>
					</Day>
				</Box>
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
