import { Suspense, lazy, useState } from 'react'
import { Container } from './home.style'
import { Box, Button, ButtonGroup, CircularProgress, Stack } from '@mui/material'
import Stepper from '@/components/Stepper/Stepper'

const Shipment = lazy(() => import('@/pages/Home/Shipment/Shipment'))
const Output = lazy(() => import('@/pages/Home/Output/Output'))

// const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
// const Quality = lazy(() => import('@/pages/Home/components/Quality/Quality'))
// const Expenses = lazy(() => import('@/pages/Home/components/Expenses/Expenses'))
// const OrderExecution = lazy(() => import('@/pages/Home/components/OrderExecution/OrderExecution'))

// type Selected = 'sqdc' | 'quality' | 'expenses' | 'order'

const steps = [
	{ id: '1', key: 'shipment', label: 'Отгрузка' },
	{ id: '2', key: 'output', label: 'Выпуск' },
	{ id: '3', key: 'orders', label: 'Приход заказов' },
	{ id: '4', key: '', label: 'Загруженность пр-ва' },
]

export default function Home() {
	const [selected, setSelected] = useState('shipment')

	// const selectHandler = (group: Selected) => () => {
	// 	setSelected(group)
	// }

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
					<Button sx={{ borderRadius: '16px' }} variant='contained'>
						День
					</Button>
					<Button>Неделя</Button>
					<Button>Месяц</Button>
					<Button>Квартал</Button>
					<Button>Год</Button>
					<Button sx={{ borderRadius: '16px' }}>Период</Button>
				</ButtonGroup>
			</Stack>

			<Stack direction={'row'} spacing={1} width={'100%'}>
				<Stepper active={selected} data={steps} onSelect={stepHandler} width='300px' />

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
				</Suspense>
			</Stack>
		</Container>
	)
}
