import { Suspense, useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Divider, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setCriterions } from '@/store/criterions'
import { useCompleteCriterionMutation, useGetCriterionsQuery } from '@/store/api/criterions'
import { Fallback } from '@/components/Fallback/Fallback'
import Stepper from '@/components/Stepper/Stepper'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Week } from '@/components/Week/Week'
import { Container } from './criterions.style'
import 'react-datasheet-grid/dist/style.css'

// const steps: IStep[] = [
// 	{ id: '', key: 'injuries', label: 'Травматизм' },
// 	{ id: '', key: 'defects', label: 'Объем исправимого брака' },
// 	{ id: '', key: 'awaiting-decision', label: 'Объем продукции ожидающей решения от ТО' },
// 	{ id: '', key: 'defect-time', label: 'Время исправления брака' },
// 	{ id: '', key: 'number-in-brigade', label: 'Численность ' },
// 	{ id: '', key: 'output-volume', label: 'Ежедневный объем выпуска продукции' },
// 	{ id: '', key: 'orders-volume', label: 'Ежедневный объем заказов на день переданных в производство' },
// 	{ id: '', key: 'shipment-plan', label: 'Выполнение плана отгрузок в деньгах' },
// ]

export default function Home() {
	const active = useAppSelector(state => state.criterions.active)
	const criterions = useAppSelector(state => state.criterions.criterions)
	const skipped = useAppSelector(state => state.criterions.skipped)
	const complete = useAppSelector(state => state.criterions.complete)
	const date = useAppSelector(state => state.criterions.date)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	//TODO обработать ошибки
	const { data } = useGetCriterionsQuery(date, { skip: !date })

	const [completeCriterion, { isLoading }] = useCompleteCriterionMutation()

	useEffect(() => {
		if (data) dispatch(setCriterions(data.data))
	}, [dispatch, data])

	useEffect(() => {
		navigate(active, { replace: true })
	}, [navigate, active])

	const competeHandler = useCallback(async () => {
		const c = criterions.find(c => c.key == active)
		if (!c) return

		try {
			await completeCriterion({ id: c.id, type: c.type, date: date }).unwrap()
		} catch (error) {
			//TODO выводить ошибку
			console.error('rejected', error)
		}
	}, [active, completeCriterion, criterions, date])

	useEffect(() => {
		if (complete) void competeHandler()
	}, [complete, competeHandler])

	const stepHandler = (key: string) => {
		// setActive(id)
		dispatch(setActive(key))

		// navigate(`${id}`)
	}

	const nextHandler = () => {
		let idx = skipped.findIndex(s => s == active)
		if (idx == -1) {
			idx = 0
			dispatch(setActive(skipped[idx]))
			return
		}

		// if (ready) dispatch(setComplete(active))
		dispatch(setActive(skipped[(idx + 1) % skipped.length]))
	}

	const prevHandler = () => {
		let idx = skipped.findIndex(s => s == active)
		if (idx == -1) {
			idx = 0
			dispatch(setActive(skipped[idx]))
			return
		}

		dispatch(setActive(skipped[(idx + skipped.length - 1) % skipped.length]))
	}

	return (
		<Container>
			{/* //TODO вывод последних 7 дней с обозначением заполнены ли были критерии */}
			<Week />

			<Stack spacing={2} direction={'row'} width={'100%'} height={'100%'}>
				<Stepper active={active} data={criterions} onSelect={stepHandler} width='350px' />

				{isLoading && (
					<Box
						position={'absolute'}
						top={0}
						left={0}
						bottom={0}
						right={0}
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						zIndex={5}
						sx={{ backgroundColor: '#eeeeee47' }}
					>
						<CircularProgress />
					</Box>
				)}

				<Box
					width={'100%'}
					padding={'20px 30px'}
					borderRadius={'12px'}
					display={'flex'}
					flexDirection={'column'}
					gap={'20px'}
					boxShadow={'rgba(54, 54, 54, 0.17) 2px 2px 8px 0px'}
					sx={{ backgroundColor: '#fff' }}
				>
					<Suspense fallback={<Fallback />}>
						<Outlet />
					</Suspense>

					{/* {active == '' && <Typography textAlign={'center'}>Критерий не выбран</Typography>} */}
					{/* {!skipped.length && active == '' ? (
						<Typography textAlign={'center'} fontSize={'1.2rem'}>
							Все критерии заполнены
						</Typography>
					) : null} */}

					<Divider sx={{ marginTop: 'auto' }} />

					<StepButtons
						finish={(!(skipped.length - 1) && skipped.includes(active)) || !skipped.length}
						next={nextHandler}
						prev={prevHandler}
					/>
				</Box>
			</Stack>
		</Container>
	)
}
