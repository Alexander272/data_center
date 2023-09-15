import { FC } from 'react'
import { Dayjs } from 'dayjs'
import { Box, Button, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIosOutlined'

type Props = {
	currentMonth: number
	year: number
	date: Dayjs
	onChange: (date: Dayjs) => void
	toggleMonth: () => void
	toggleYear: () => void
}

const DaysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
export const MonthsOfYear = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
]

export const Captions: FC<Props> = ({ currentMonth, year, date, onChange, toggleMonth, toggleYear }) => {
	const nextMonth = () => {
		onChange(date.add(1, 'M'))
	}
	const prevMonth = () => {
		onChange(date.subtract(1, 'M'))
	}

	const renderWeek = () => {
		return DaysOfWeek.map(d => (
			<Box
				key={d}
				border={'2px solid transparent'}
				borderRadius={'100%'}
				display={'flex'}
				justifyContent={'center'}
				alignItems={'center'}
				height={40}
				width={40}
				fontWeight={'bold'}
			>
				{d}
			</Box>
		))
	}

	return (
		<>
			<Stack direction={'row'} alignItems={'baseline'} mb={1}>
				<Button onClick={prevMonth} sx={{ borderRadius: '12px', minWidth: 48 }}>
					<ArrowBackIcon sx={{ fontSize: '16px' }} />
				</Button>

				<Typography
					onClick={toggleMonth}
					fontWeight={'bold'}
					fontSize={'18px'}
					ml={'auto'}
					sx={{ cursor: 'pointer' }}
				>
					{MonthsOfYear[currentMonth]}
				</Typography>
				<Typography fontWeight={'bold'} fontSize={'18px'} pl={0.5} pr={0.5}>
					/
				</Typography>
				<Typography
					onClick={toggleYear}
					fontWeight={'bold'}
					fontSize={'18px'}
					mr={'auto'}
					sx={{ cursor: 'pointer' }}
				>
					{year}
				</Typography>

				<Button onClick={nextMonth} sx={{ borderRadius: '12px', minWidth: 48 }}>
					<ArrowForwardIcon sx={{ fontSize: '16px' }} />
				</Button>
			</Stack>
			<Stack direction={'row'} ml={'auto'}>
				{renderWeek()}
			</Stack>
		</>
	)
}
