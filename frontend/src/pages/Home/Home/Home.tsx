import { MouseEvent, Suspense, lazy, useState } from 'react'
import { Box, Button, ButtonGroup, CircularProgress, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setPeriodType } from '@/store/dashboard'
import type { PeriodEnum } from '@/types/period'
import Stepper from '@/components/Stepper/Stepper'
import { Container } from './home.style'

const Shipment = lazy(() => import('@/pages/Home/Shipment/Shipment'))
const Output = lazy(() => import('@/pages/Home/Output/Output'))
const Orders = lazy(() => import('@/pages/Home/Orders/Orders'))

// const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
// const Quality = lazy(() => import('@/pages/Home/components/Quality/Quality'))
// const Expenses = lazy(() => import('@/pages/Home/components/Expenses/Expenses'))
// const OrderExecution = lazy(() => import('@/pages/Home/components/OrderExecution/OrderExecution'))

// type Selected = 'sqdc' | 'quality' | 'expenses' | 'order'

const steps = [
	{ id: '1', key: 'shipment', label: 'Выполнение плана отгрузок' },
	{ id: '2', key: 'output', label: 'Объем выпуска продукции' },
	{ id: '3', key: 'orders', label: 'Объем заказов переданных в производство' },
	{ id: '4', key: 'load', label: 'Загруженность производства' },
]

export default function Home() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [selected, setSelected] = useState('shipment')

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
						disabled
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

				<Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }} width={'100%'}>
					<Stack direction={'row'} mb={3}>
						<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
							<ArrowBackIcon />
						</Button>

						<Typography fontWeight={'bold'} fontSize={'1.6rem'} ml={'auto'} mr={'auto'}>
							{steps.find(s => s.key == selected)?.label} ({period.from}
							{period.to ? '-' + period.to : ''})
						</Typography>

						<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
							<ArrowForwardIcon />
						</Button>
					</Stack>

					<Suspense
						fallback={
							<Box
								width={'100%'}
								display={'flex'}
								height={'100%'}
								justifyContent={'center'}
								alignItems={'center'}
							>
								<CircularProgress />
							</Box>
						}
					>
						{selected == 'shipment' && <Shipment />}
						{selected == 'output' && <Output />}
						{selected == 'orders' && <Orders />}
					</Suspense>
				</Box>
			</Stack>
		</Container>
	)
}
