import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { CircularProgress, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setCriterions } from '@/store/criterions'
import type { IStep } from '@/components/Stepper/step.type'
import Stepper from '@/components/Stepper/Stepper'
import { Week } from '@/components/Week/Week'
import { Container } from './criterions.style'
import 'react-datasheet-grid/dist/style.css'

const steps: IStep[] = [
	{ id: 'injuries', label: 'Травматизм' },
	{ id: 'defects', label: 'Объем исправимого брака' },
	// { id: '', label: 'Объем продукции ожидающей решения от ТО' },
	{ id: 'defect-time', label: 'Время исправления брака' },
	{ id: 'number-in-brigade', label: 'Численность ' },
	{ id: 'output-volume', label: 'Ежедневный объем выпуска продукции' },
	{ id: 'orders-volume', label: 'Ежедневный объем заказов на день переданных в производство' },
	{ id: 'shipment-plan', label: 'Выполнение плана отгрузок в деньгах' },
]

export default function Home() {
	// const [active, setActive] = useState(steps[0].id)
	const active = useAppSelector(state => state.criterions.active)
	const criterions = useAppSelector(state => state.criterions.criterions)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(setCriterions(steps))
	}, [dispatch])

	useEffect(() => {
		navigate(active)
	}, [navigate, active])

	const stepHandler = (id: string) => {
		// setActive(id)
		dispatch(setActive(id))

		// navigate(`${id}`)
	}

	return (
		<Container>
			{/* //TODO вывод последних 7 дней с обозначением заполнены ли были критерии */}
			<Week />

			<Stack spacing={2} direction={'row'} width={'100%'} height={'100%'}>
				<Stepper active={active} data={criterions} onSelect={stepHandler} width='350px' />

				<Suspense fallback={<CircularProgress />}>
					<Outlet />
				</Suspense>
			</Stack>
		</Container>
	)
}
