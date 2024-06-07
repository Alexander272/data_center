import { Suspense, useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Divider, Stack } from '@mui/material'
import 'react-datasheet-grid/dist/style.css'

import type { IResError } from '@/types/err'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setCriterions } from '@/store/criterions'
import { getMenu } from '@/store/user'
import { useCompleteCriterionMutation, useGetCriterionsQuery } from '@/store/api/criterions'
import { TableFallBack } from '@/pages/Home/components/Fallback/FallBack'
import { Fallback } from '@/components/Fallback/Fallback'
import Stepper from '@/components/Stepper/Stepper'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Week } from '@/components/Week/Week'
import { IToast, Toast } from '@/components/Toast/Toast'
import { Container } from './criterions.style'

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

export default function Criterions() {
	const active = useAppSelector(state => state.criterions.active)
	const criterions = useAppSelector(state => state.criterions.criterions)
	const skipped = useAppSelector(state => state.criterions.skipped)
	const complete = useAppSelector(state => state.criterions.complete)
	const date = useAppSelector(state => state.criterions.date)
	const menu = useAppSelector(getMenu)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	const { data, error, isFetching } = useGetCriterionsQuery(date, { skip: !date })

	const [completeCriterion, { isLoading }] = useCompleteCriterionMutation()

	useEffect(() => {
		if (data) {
			const newCriterions = data.data.filter(c => menu.includes(c.key + ':write'))
			dispatch(setCriterions(newCriterions))
		}
	}, [dispatch, data, menu])

	useEffect(() => {
		navigate(active, { replace: true })
	}, [navigate, active])

	useEffect(() => {
		if (error) {
			console.error('useGetCriterionsQuery error', error)
			setToast({ type: 'error', message: (error as IResError).data.message, open: true })
		}
	}, [error])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const competeHandler = useCallback(async () => {
		const c = criterions.find(c => c.key == active)
		if (!c) return

		try {
			await completeCriterion({ criterionId: c.id, date: +date }).unwrap()
		} catch (error) {
			setToast({ type: 'error', message: (error as IResError).data.message, open: true })
			console.error('rejected', error)
		}
	}, [active, completeCriterion, criterions, date])

	useEffect(() => {
		if (complete) void competeHandler()
	}, [complete, competeHandler])

	const stepHandler = (key: string) => {
		dispatch(setActive(key))
	}

	const nextHandler = () => {
		let idx = skipped.findIndex(s => s == active)
		if (idx == -1) {
			idx = 0
			dispatch(setActive(skipped[idx]))
			return
		}

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
			<Toast data={toast} onClose={closeHandler} />
			{/* вывод последних 7 дней с обозначением заполнены ли были критерии */}
			<Week />

			<Stack spacing={2} direction={'row'} width={'100%'} height={'100%'}>
				<Stepper active={active} data={criterions} onSelect={stepHandler} width='350px' />

				{isFetching ? <TableFallBack /> : null}
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
