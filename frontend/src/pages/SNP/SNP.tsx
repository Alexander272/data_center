import { useRef, useState } from 'react'
import { Box, Button, Menu, Stack, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined'

import { FormatDate } from '@/constants/format'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { nextPeriod, prevPeriod, setPeriod, setPeriodType } from '@/store/dashboard'
import { Load } from '@/features/snp/components/Load/Load'
import { Production } from '@/features/snp/components/Production/Production'
import { Costs } from '@/features/snp/components/Costs/Costs'
import { Calendar } from '@/components/Calendar/Calendar'
import { PageBox } from '../styled/PageBox'

const pickerType = {
	day: 'day' as const,
	week: 'week' as const,
	month: 'month' as const,
	year: 'year' as const,
	quarter: undefined,
	period: undefined,
}

export default function SNP() {
	const [open, setOpen] = useState(false)
	const anchor = useRef<HTMLButtonElement>(null)

	const period = useAppSelector(state => state.dashboard.period)
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const dispatch = useAppDispatch()

	//TODO
	if (periodType != 'week') {
		dispatch(setPeriodType('week'))
	}

	const toggleCalendar = () => {
		setOpen(prev => !prev)
	}

	const prevHandler = () => {
		dispatch(prevPeriod())
	}
	const nextHandler = () => {
		dispatch(nextPeriod())
	}

	const periodHandler = (date: [from: Dayjs, to?: Dayjs]) => {
		dispatch(setPeriod({ from: date[0].unix().toString(), to: date[1]?.unix().toString() }))
		setOpen(false)
	}

	return (
		<PageBox>
			<Box
				padding={2}
				borderRadius={'16px'}
				width={'100%'}
				minHeight={200}
				height={'100%'}
				boxShadow={'rgba(54, 54, 54, 0.17) 0px 0px 4px 0px'}
				position={'relative'}
				display={'flex'}
				flexDirection={'column'}
				sx={{ backgroundColor: '#fff' }}
			>
				<Stack direction={'row'} alignItems={'center'}>
					<Button onClick={prevHandler} sx={{ borderRadius: '12px', minWidth: 48 }}>
						<ArrowBackIcon />
					</Button>

					<Typography fontWeight={'bold'} fontSize={'1.6rem'} ml={'auto'}>
						{/* {steps.find(s => s.key == selected)?.label}  */}
						{dayjs(+period.from * 1000).format(FormatDate)}
						{period.to ? '-' + dayjs(+period.to * 1000).format(FormatDate) : ''}
					</Typography>
					<Button
						onClick={toggleCalendar}
						ref={anchor}
						color='inherit'
						// disabled={periodType != 'day'}
						sx={{ mr: 'auto', borderRadius: '12px', minWidth: 48 }}
					>
						<CalendarIcon />
					</Button>

					<Button
						disabled={
							dayjs()
								.subtract(1, 'd')
								.diff(dayjs(+period.from * 1000), 'd') <= 0 ||
							dayjs()
								.subtract(1, 'd')
								.diff(dayjs(+(period.to || 0) * 1000), 'd') <= 0
						}
						onClick={nextHandler}
						sx={{ borderRadius: '12px', minWidth: 48 }}
					>
						<ArrowForwardIcon />
					</Button>
				</Stack>

				<Menu
					open={open}
					onClose={toggleCalendar}
					anchorEl={anchor.current}
					transformOrigin={{ horizontal: 'center', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
					MenuListProps={{
						role: 'listbox',
						disableListWrap: true,
					}}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: 'visible',
								padding: 0,
								mt: 1.2,
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									left: '50%',
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translate(-50%, -50%) rotate(45deg)',
									zIndex: 0,
								},
							},
						},
					}}
				>
					<Calendar
						selected={dayjs(+period.from * 1000)}
						range={[dayjs(+period.from * 1000), dayjs(+(period.to || 0) * 1000)]}
						picker={pickerType[periodType]}
						onSelect={periodHandler}
					/>
				</Menu>

				<Stack direction={'row'} flexGrow={1} justifyContent={'space-around'}>
					<Box width={'49%'} height={450}>
						<Costs />
					</Box>
					<Box width={'49%'} height={450}>
						<Production />
					</Box>
				</Stack>
				<Typography textAlign={'center'} fontWeight={'bold'}>
					Загруженость участка
				</Typography>
				<Load />
			</Box>
		</PageBox>
	)
}
