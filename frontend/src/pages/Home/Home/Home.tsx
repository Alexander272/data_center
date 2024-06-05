import { MouseEvent, Suspense, lazy, useRef, useState } from 'react'
import { Box, Button, ButtonGroup, Menu, Stack, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined'

import type { PeriodEnum } from '@/types/period'
import { FormatDate } from '@/constants/format'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { nextPeriod, prevPeriod, setPeriod, setPeriodType } from '@/store/dashboard'
import { Calendar } from '@/components/Calendar/Calendar'
import Stepper from '@/components/Stepper/Stepper'
import { TableFallBack } from '../components/Fallback/FallBack'
import { Container } from './home.style'

const ProductionPlan = lazy(() => import('@/pages/Home/ProductionPlan/ProductionPlan'))
const Shipment = lazy(() => import('@/pages/Home/Shipment/Shipment'))
const Output = lazy(() => import('@/pages/Home/Output/Output'))
const Orders = lazy(() => import('@/pages/Home/Orders/Orders'))
const Load = lazy(() => import('@/pages/Home/Load/Load'))
const ShippingPlan = lazy(() => import('@/pages/Home/ShippingPlan/ShippingPlan'))
const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
const SemiFinished = lazy(() => import('@/pages/Home/SemiFinished/SemiFinished'))
const Tooling = lazy(() => import('@/pages/Home/Tooling/Tooling'))

// const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
// const Quality = lazy(() => import('@/pages/Home/components/Quality/Quality'))
// const Expenses = lazy(() => import('@/pages/Home/components/Expenses/Expenses'))
// const OrderExecution = lazy(() => import('@/pages/Home/components/OrderExecution/OrderExecution'))

// type Selected = 'sqdc' | 'quality' | 'expenses' | 'order'

const steps = [
	{ id: '1', key: 'production_plan', label: 'Выполнение годового плана' },
	{ id: '2', key: 'shipping_plan', label: 'План отгрузок' },
	// { id: '2', key: 'shipment', label: 'Выполнение плана отгрузок' },
	{ id: '3', key: 'output', label: 'Объем выпуска продукции' },
	{ id: '4', key: 'orders', label: 'Объем заказов переданных в производство' },
	{ id: '5', key: 'load', label: 'Загруженность производства' },
	{ id: '6', key: 'semi-finished', label: 'Производство полуфабрикатов' },
	{ id: '7', key: 'tooling', label: 'Производство оснастки' },
	// { id: '6', key: 'sqdc', label: 'SQDC' },
]

const pickerType = {
	day: 'day' as const,
	week: 'week' as const,
	month: 'month' as const,
	year: 'year' as const,
	quarter: undefined,
	period: undefined,
}

const components = {
	production_plan: <ProductionPlan />,
	shipment: <Shipment />,
	shipping_plan: <ShippingPlan />,
	output: <Output />,
	orders: <Orders />,
	load: <Load />,
	sqdc: <SQDC />,
	'semi-finished': <SemiFinished />,
	tooling: <Tooling />,
}

export default function Home() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [selected, setSelected] = useState('production_plan')
	const [open, setOpen] = useState(false)
	const anchor = useRef<HTMLButtonElement>(null)

	const dispatch = useAppDispatch()

	// const selectHandler = (group: Selected) => () => {
	// 	setSelected(group)
	// }

	const typeHandler = (event: MouseEvent<HTMLButtonElement>) => {
		const name = (event.target as HTMLButtonElement).name
		dispatch(setPeriodType(name as PeriodEnum))
	}

	const stepHandler = (key: string) => {
		// dispatch(setActive(key))
		setSelected(key)
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

	// console.log(dayjs(period.from, 'DD.MM.YYYY').unix() >= dayjs().subtract(1, 'd').unix())
	// console.log(dayjs().subtract(1, 'd').diff(dayjs(period.from, 'DD.MM.YYYY'), 'd') <= 0)
	// console.log(dayjs().subtract(1, 'd').diff(dayjs(period.to, 'DD.MM.YYYY'), 'd') <= 0)
	// console.log(dayjs(period.from, 'DD.MM.YYYY').unix(), dayjs().subtract(1, 'd').unix())

	return (
		<Container>
			{/* <Stack direction={'row'} spacing={2} width={'100%'} justifyContent={'center'}>
				<Group active={selected == 'sqdc'} onClick={selectHandler('sqdc')}>
					SQDC???
				</Group>
				<Group active={selected == 'quality'} onClick={selectHandler('quality')}>
					Качество
				</Group>
				<Group active={selected == 'expenses'} onClick={selectHandler('expenses')}>
					Затраты
				</Group>
				<Group active={selected == 'order'} onClick={selectHandler('order')}>
					Исполнение заказа
				</Group>
			</Stack>

			<Suspense fallback={<CircularProgress />}>
				{selected == 'sqdc' && <SQDC />}
				{selected == 'quality' && <Quality />}
				{selected == 'expenses' && <Expenses />}
				{selected == 'order' && <OrderExecution />}
			</Suspense> */}

			<Stack direction={'row'} justifyContent={'center'} mb={1}>
				<ButtonGroup sx={{ borderRadius: '16px', backgroundColor: '#fff' }}>
					<Button
						name='day'
						onClick={typeHandler}
						variant={periodType == 'day' ? 'contained' : 'outlined'}
						sx={{ borderRadius: '16px' }}
					>
						День
					</Button>
					<Button name='week' onClick={typeHandler} variant={periodType == 'week' ? 'contained' : 'outlined'}>
						Неделя
					</Button>
					<Button
						name='month'
						onClick={typeHandler}
						variant={periodType == 'month' ? 'contained' : 'outlined'}
					>
						Месяц
					</Button>
					<Button
						disabled
						name='quarter'
						onClick={typeHandler}
						variant={periodType == 'quarter' ? 'contained' : 'outlined'}
					>
						Квартал
					</Button>
					<Button
						disabled
						name='year'
						onClick={typeHandler}
						variant={periodType == 'year' ? 'contained' : 'outlined'}
					>
						Год
					</Button>
					<Button
						disabled
						name='period'
						onClick={typeHandler}
						variant={periodType == 'period' ? 'contained' : 'outlined'}
						sx={{ borderRadius: '16px' }}
					>
						Период
					</Button>
				</ButtonGroup>
			</Stack>

			<Stack direction={'row'} spacing={1} width={'100%'}>
				<Stepper active={selected} data={steps} onSelect={stepHandler} width='300px' />

				<Box
					padding={2}
					borderRadius={'16px'}
					width={'100%'}
					boxShadow={'rgba(54, 54, 54, 0.17) 0px 0px 4px 0px'}
					position={'relative'}
					sx={{ backgroundColor: '#fff' }}
				>
					<Stack direction={'row'} mb={3}>
						<Button onClick={prevHandler} sx={{ borderRadius: '12px', minWidth: 48 }}>
							<ArrowBackIcon />
						</Button>

						<Typography fontWeight={'bold'} fontSize={'1.6rem'} ml={'auto'}>
							{steps.find(s => s.key == selected)?.label} ({dayjs(+period.from * 1000).format(FormatDate)}
							{period.to ? '-' + dayjs(+period.to * 1000).format(FormatDate) : ''})
						</Typography>
						<Button
							onClick={toggleCalendar}
							ref={anchor}
							color='inherit'
							// disabled={periodType != 'day'}
							sx={{ marginRight: 'auto', borderRadius: '12px', minWidth: 48 }}
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

					<Suspense fallback={<TableFallBack />}>
						{/* {selected == 'production_plan' && <ProductionPlan />}
						{selected == 'shipment' && <Shipment />}
						{selected == 'output' && <Output />}
						{selected == 'orders' && <Orders />}
						{selected == 'load' && <Load />} */}
						{components[selected as 'load']}
						{/* {selected == 'sqdc' && <SQDC />} */}
					</Suspense>
				</Box>
			</Stack>
		</Container>
	)
}
