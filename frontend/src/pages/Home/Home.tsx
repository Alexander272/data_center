import { Suspense, lazy } from 'react'
import { Container } from './home.style'
import { Button, ButtonGroup, CircularProgress, Stack } from '@mui/material'

const Shipment = lazy(() => import('@/pages/Home/components/Shipment/Shipment'))

// const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
// const Quality = lazy(() => import('@/pages/Home/components/Quality/Quality'))
// const Expenses = lazy(() => import('@/pages/Home/components/Expenses/Expenses'))
// const OrderExecution = lazy(() => import('@/pages/Home/components/OrderExecution/OrderExecution'))

// type Selected = 'sqdc' | 'quality' | 'expenses' | 'order'

export default function Home() {
	// const [selected, setSelected] = useState<Selected>('sqdc')

	// const selectHandler = (group: Selected) => () => {
	// 	setSelected(group)
	// }

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

			<Suspense fallback={<CircularProgress />}>
				<Shipment />
			</Suspense>
		</Container>
	)
}
