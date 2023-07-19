import { Suspense, useEffect } from 'react'
import Stepper from '@/components/Stepper/Stepper'
import { Container } from './criterions.style'
import type { IStep } from '@/components/Stepper/step.type'
import { CircularProgress } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setCriterions } from '@/store/criterions'
import 'react-datasheet-grid/dist/style.css'

const steps: IStep[] = [
	{ id: 'injuries', label: 'Травматизм' },
	{ id: 'defects', label: 'Объем исправимого брака' },
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
			<Stepper active={active} data={criterions} onSelect={stepHandler} width='350px' />

			<Suspense fallback={<CircularProgress />}>
				<Outlet />
			</Suspense>
		</Container>
	)
}
