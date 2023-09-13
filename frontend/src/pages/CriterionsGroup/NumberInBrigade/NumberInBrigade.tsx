import { useState } from 'react'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Divider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { INumberInBrigade } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

export default function NumberInBrigade() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [ready, setReady] = useState(false)

	const [data, setData] = useState<INumberInBrigade[]>([
		{ number: null, brigade: '' },
		{ number: null, brigade: '' },
	])

	const dispatch = useAppDispatch()

	const columns: Column<INumberInBrigade>[] = [
		{ ...keyColumn<INumberInBrigade, 'number'>('number', intColumn), title: 'Кол-во человек в смене' },
		{ ...keyColumn<INumberInBrigade, 'brigade'>('brigade', textColumn), title: 'Смена' },
	]

	const dataHandler = (data: INumberInBrigade[]) => {
		setData(data)
	}

	const saveHandler = () => {
		console.log('save')
		setReady(true)
	}

	const nextHandler = () => {
		//TODO по идее это можно закольцевать до тех пор пока остаются не заполненные критерии
		const idx = skipped.findIndex(s => s == active)
		if (idx == -1) return

		// if (ready) dispatch(setComplete(active))
		if (ready) dispatch(setComplete())
		if (idx <= skipped.length - 1) dispatch(setActive(skipped[idx + 1]))
	}

	const prevHandler = () => {
		console.log('prev')
	}

	return (
		<Container>
			<Typography variant='h5' textAlign='center'>
				Численность
			</Typography>

			<DataSheetGrid value={data} columns={columns} onChange={dataHandler} lockRows />

			<Button variant='outlined' onClick={saveHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>

			<Divider sx={{ marginTop: 'auto' }} />

			<StepButtons finish={!(skipped.length - 1)} next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
