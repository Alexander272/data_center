import { FC, MouseEvent, useState } from 'react'
import { Box, Collapse, Stack } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { Captions } from './Captions'
import { Months } from './Months'
import { Years } from './Years'
import { DateGrid } from './DateGrid'
// import { IPeriod } from '@/types/period'

type Props = {
	selected?: Dayjs
	startDate?: Dayjs
	endDate?: Dayjs
	range?: [from: Dayjs, to?: Dayjs]
	// selected: string | IPeriod
	onSelect?: (date: [from: Dayjs, to?: Dayjs]) => void
	// mode?: 'single' | 'range'
	picker?: 'day' | 'week' | 'month' | 'year'
	// selectSize?: number
	// showOutsideDays?: boolean
	// fixedWeeks?: boolean
	showWeekNumber?: boolean
}

export const Calendar: FC<Props> = ({ selected, range, onSelect, picker = 'day' }) => {
	const [date, setDate] = useState(selected ? selected : dayjs())
	const [period, setPeriod] = useState(range ? [range[0], range[1] ? range[1] : undefined] : [])

	const [openMonth, setOpenMonth] = useState(picker == 'month')
	const [openYears, setOpenYears] = useState(picker == 'year')

	const changeDateHandler = (date: Dayjs) => {
		setDate(date)
	}
	const changeMonthHandler = (date: Dayjs) => {
		setDate(date)
		setOpenMonth(false)
		if (picker == 'month' && onSelect) onSelect([date, date.endOf(picker)])
	}
	const changeYearHandler = (date: Dayjs) => {
		setDate(date)
		setOpenYears(false)
		if (picker == 'year' && onSelect) onSelect([date, date.endOf(picker)])
	}

	const toggleMonth = () => {
		if (picker != 'year' && picker != 'month') setOpenMonth(prev => !prev)
	}
	const toggleYear = () => {
		if (picker != 'year') setOpenYears(prev => !prev)
	}

	const selectDate = (event: MouseEvent<HTMLDivElement>) => {
		const { day } = (event.target as HTMLDivElement).dataset
		if (!day) return
		const newDate = dayjs(day, 'DD.MM.YYYY')
		setDate(newDate)
		if (picker != 'day') {
			const from = newDate.startOf(picker)
			const to = newDate.endOf(picker)

			setPeriod([from, to])
			onSelect && onSelect([from, to])
			return
		}
		onSelect && onSelect([newDate])
	}

	return (
		<Stack
			maxWidth={'300px'}
			width={'300px'}
			// boxShadow={'0 0 5px #8798ad'}
			p={1}
			pb={0}
			borderRadius={'8px'}
			position={'relative'}
			overflow={'hidden'}
		>
			<Captions
				currentMonth={date.month()}
				year={date.year()}
				date={date}
				onChange={changeDateHandler}
				toggleMonth={toggleMonth}
				toggleYear={toggleYear}
			/>

			<Box position={'absolute'} zIndex={5} top={40} bottom={0} left={0} right={0} sx={{ pointerEvents: 'none' }}>
				<Collapse in={openMonth} timeout={'auto'} unmountOnExit>
					<Months date={date} onChange={changeMonthHandler} />
				</Collapse>
			</Box>

			<Box position={'absolute'} zIndex={5} top={40} bottom={0} left={0} right={0} sx={{ pointerEvents: 'none' }}>
				<Collapse in={openYears} timeout={'auto'} unmountOnExit>
					<Years date={dayjs()} selected={date} onChange={changeYearHandler} />
				</Collapse>
			</Box>

			<Box onClick={selectDate}>
				<DateGrid
					date={date}
					selected={
						picker == 'day' ? date.format('DD.MM.YYYY') : period.map(p => (p ? p.format('DD.MM.YYYY') : ''))
						// : [period[0]?.format('DD.MM.YYYY') || '', period[1]?.format('DD.MM.YYYY') || '']
					}
					picker={picker}
				/>
			</Box>
		</Stack>
	)
}
