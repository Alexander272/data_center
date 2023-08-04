import { Suspense, lazy, useState } from 'react'
import { Container, Group } from './home.style'
import { CircularProgress, Stack } from '@mui/material'

const SQDC = lazy(() => import('@/pages/Home/components/SQDC/SQDC'))
const Quality = lazy(() => import('@/pages/Home/components/Quality/Quality'))
const Expenses = lazy(() => import('@/pages/Home/components/Expenses/Expenses'))
const OrderExecution = lazy(() => import('@/pages/Home/components/OrderExecution/OrderExecution'))

type Selected = 'sqdc' | 'quality' | 'expenses' | 'order'

export default function Home() {
	const [selected, setSelected] = useState<Selected>('sqdc')

	const selectHandler = (group: Selected) => () => {
		setSelected(group)
	}

	return (
		<Container>
			<Stack direction={'row'} spacing={2} width={'100%'} justifyContent={'center'}>
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
			</Suspense>
		</Container>
	)
}
