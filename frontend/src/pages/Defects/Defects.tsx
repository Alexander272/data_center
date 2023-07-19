import { useState } from 'react'
import { Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { Column, DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IDefect } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from './defects.style'

export default function Defects() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [hasDefects, setHasDefects] = useState(false)
	const [ready, setReady] = useState(false)

	const [data, setData] = useState<IDefect[]>([
		{ order: '', position: '', defect: '', place: '' },
		{ order: '', position: '', defect: '', place: '' },
		{ order: '', position: '', defect: '', place: '' },
		{ order: '', position: '', defect: '', place: '' },
		{ order: '', position: '', defect: '', place: '' },
	])

	const dispatch = useAppDispatch()

	const columns: Column<IDefect>[] = [
		{
			...keyColumn<IDefect, 'order'>('order', textColumn),
			title: '№ Заказа',
			grow: 0.5,
		},
		{
			...keyColumn<IDefect, 'position'>('position', textColumn),
			title: '№ Позиции',
			grow: 0.5,
		},
		{
			...keyColumn<IDefect, 'defect'>('defect', textColumn),
			title: 'Тип дефекта',
		},
		{
			...keyColumn<IDefect, 'place'>('place', textColumn),
			title: 'Участок',
		},
	]

	const haveDefectsHandler = () => {
		setHasDefects(true)
		setReady(false)
	}

	const noDefectsHandler = () => {
		setHasDefects(false)
		setReady(true)
	}

	const dataHandler = (data: IDefect[]) => {
		setData(data)
	}

	const saveHandler = () => {
		console.log('save')
		setReady(true)
	}

	const nextHandler = () => {
		const idx = skipped.findIndex(s => s == active)
		if (idx == -1) return

		if (ready) dispatch(setComplete(active))
		if (idx <= skipped.length - 1) dispatch(setActive(skipped[idx + 1]))
	}

	const prevHandler = () => {
		console.log('prev')
	}

	return (
		<Container>
			<Typography variant='h5' textAlign='center'>
				Сегодня были исправленные дефекты?
			</Typography>

			<Stack spacing={1} direction={'row'} width={300} margin={'0 auto'}>
				<Button variant='outlined' onClick={haveDefectsHandler} fullWidth sx={{ borderRadius: 8 }}>
					Да
				</Button>
				<Button
					variant='outlined'
					color='success'
					onClick={noDefectsHandler}
					fullWidth
					sx={{ borderRadius: 8 }}
				>
					Нет
				</Button>
			</Stack>

			{hasDefects && (
				<>
					<Stack spacing={2} direction={'row'} alignItems={'center'}>
						<Typography>Количество принятых изделий</Typography>
						<TextField size='small' />
					</Stack>

					<DataSheetGrid
						value={data}
						columns={columns}
						onChange={dataHandler}
						autoAddRow
						addRowsComponent={false}
					/>

					<Button
						variant='outlined'
						onClick={saveHandler}
						sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}
					>
						Сохранить
					</Button>
				</>
			)}

			<Divider sx={{ marginTop: 'auto' }} />

			<StepButtons finish={!(skipped.length - 1)} next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
