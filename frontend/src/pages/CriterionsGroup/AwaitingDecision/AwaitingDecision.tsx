import { useState } from 'react'
import { Button, Divider, Typography } from '@mui/material'
import { Column, DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IAwaitingDecision } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

export default function AwaitingDecision() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [ready, setReady] = useState(false)

	const [data, setData] = useState<IAwaitingDecision[]>([
		{ order: '', name: '', defect: '', decision: '' },
		{ order: '', name: '', defect: '', decision: '' },
		{ order: '', name: '', defect: '', decision: '' },
		{ order: '', name: '', defect: '', decision: '' },
		{ order: '', name: '', defect: '', decision: '' },
	])

	const dispatch = useAppDispatch()

	const columns: Column<IAwaitingDecision>[] = [
		{ ...keyColumn<IAwaitingDecision, 'order'>('order', textColumn), title: '№ Заказа', grow: 0.3 },
		{ ...keyColumn<IAwaitingDecision, 'name'>('name', textColumn), title: 'Наименование' },
		{ ...keyColumn<IAwaitingDecision, 'defect'>('defect', textColumn), title: 'Тип дефекта' },
		{ ...keyColumn<IAwaitingDecision, 'decision'>('decision', textColumn), title: 'Решение' },
	]

	const dataHandler = (data: IAwaitingDecision[]) => {
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
				Продукция ожидающая решения от ТО
			</Typography>

			<DataSheetGrid value={data} columns={columns} onChange={dataHandler} autoAddRow addRowsComponent={false} />

			<Button variant='outlined' onClick={saveHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>

			<Divider sx={{ marginTop: 'auto' }} />

			<StepButtons finish={!(skipped.length - 1)} next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
