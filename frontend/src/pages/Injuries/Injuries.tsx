import { useState } from 'react'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { Column, DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IInjuries } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from './injuries.style'

export default function Injuries() {
	const [hasInjuries, setHasInjuries] = useState(false)
	const [ready, setReady] = useState(false)

	const [data, setData] = useState<IInjuries[]>([
		{ name: '', injury: '', brigade: '' },
		{ name: '', injury: '', brigade: '' },
		{ name: '', injury: '', brigade: '' },
		{ name: '', injury: '', brigade: '' },
		{ name: '', injury: '', brigade: '' },
	])

	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const dispatch = useAppDispatch()

	const columns: Column<IInjuries>[] = [
		{ ...keyColumn<IInjuries, 'name'>('name', textColumn), title: 'ФИО пострадавшего' },
		{ ...keyColumn<IInjuries, 'injury'>('injury', textColumn), title: 'Травма' },
		{ ...keyColumn<IInjuries, 'brigade'>('brigade', textColumn), title: 'Смена' },
	]

	const haveInjuriesHandler = () => {
		setHasInjuries(true)
		setReady(false)
	}

	const noInjuriesHandler = () => {
		setHasInjuries(false)
		setReady(true)
	}

	const dataHandler = (data: IInjuries[]) => {
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
				Сегодня были травмы?
			</Typography>

			<Stack spacing={1} direction={'row'} width={300} margin={'0 auto'}>
				<Button variant='outlined' onClick={haveInjuriesHandler} fullWidth sx={{ borderRadius: 8 }}>
					Да
				</Button>
				<Button
					variant='outlined'
					color='success'
					onClick={noInjuriesHandler}
					fullWidth
					sx={{ borderRadius: 8 }}
				>
					Нет
				</Button>
			</Stack>

			{hasInjuries && (
				<>
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

			<StepButtons next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
