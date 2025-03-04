import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Divider, Menu, Stack, Typography } from '@mui/material'
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined'
import 'react-datasheet-grid/dist/style.css'

import type { IResError } from '@/types/err'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setCriterions, setDate } from '@/store/criterions'
import { getMenu } from '@/store/user'
import { useCompleteCriterionMutation, useGetCriterionsQuery } from '@/store/api/criterions'
import { TableFallBack } from '@/pages/Home/components/Fallback/FallBack'
import { Fallback } from '@/components/Fallback/Fallback'
import Stepper from '@/components/Stepper/Stepper'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Week } from '@/components/Week/Week'
import { IToast, Toast } from '@/components/Toast/Toast'
import { Container } from './criterions.style'
import { Calendar } from '@/components/Calendar/Calendar'
import dayjs, { Dayjs } from 'dayjs'

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

	const anchor = useRef<HTMLButtonElement>(null)
	const [open, setOpen] = useState(false)

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
	const toggleCalendar = () => {
		setOpen(prev => !prev)
	}

	const dateHandler = (date: [from: Dayjs, to?: Dayjs]) => {
		toggleCalendar()
		if (date[0].isAfter(dayjs())) {
			setToast({ type: 'error', message: 'Нельзя выбрать будущую дату', open: true })
			return
		}
		dispatch(setDate(date[0].unix().toString()))
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
			<Stack
				width={'100%'}
				direction={'row'}
				spacing={1}
				mb={2}
				justifyContent={'center'}
				alignItems={'flex-end'}
			>
				<Week />

				<Box
					onClick={toggleCalendar}
					ref={anchor}
					sx={{
						borderRadius: '8px',
						minWidth: 44,
						width: 60,
						height: 48,
						background: '#fff',
						border: '2px solid var(--gray-border)',
						position: 'relative',
						cursor: 'pointer',
						transition: 'all 0.3s ease-in-out',
						'&:hover': {
							backgroundColor: '#e1effe',
						},
					}}
				>
					<Typography fontSize={'1.0rem'} pl={1} sx={{ pointerEvents: 'none' }}>
						{dayjs(+date * 1000).format('DD.MM')}
					</Typography>

					<Box
						position={'absolute'}
						right={'50%'}
						bottom={4}
						height={'18px'}
						sx={{ pointerEvents: 'none', transform: 'translateX(50%)' }}
					>
						<CalendarIcon fontSize={'small'} />
					</Box>
				</Box>
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
				<Calendar selected={dayjs(+date * 1000)} onSelect={dateHandler} />
			</Menu>

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
