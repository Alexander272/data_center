import { useState } from 'react'
import { Button, Divider, Typography } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IDefectTime } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

export default function DefectsTime() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [ready, setReady] = useState(false)

	const [data, setData] = useState<IDefectTime[]>([
		{ order: '', name: '', defect: '', executor: '', time: null },
		{ order: '', name: '', defect: '', executor: '', time: null },
		{ order: '', name: '', defect: '', executor: '', time: null },
		{ order: '', name: '', defect: '', executor: '', time: null },
		{ order: '', name: '', defect: '', executor: '', time: null },
	])

	const dispatch = useAppDispatch()

	const columns: Column<IDefectTime>[] = [
		{ ...keyColumn<IDefectTime, 'order'>('order', textColumn), title: '№ Заказа', grow: 0.3 },
		{ ...keyColumn<IDefectTime, 'name'>('name', textColumn), title: 'Наименование' },
		{ ...keyColumn<IDefectTime, 'defect'>('defect', textColumn), title: 'Тип дефекта' },
		{ ...keyColumn<IDefectTime, 'executor'>('executor', textColumn), title: 'Исполнитель' },
		{ ...keyColumn<IDefectTime, 'time'>('time', intColumn), title: 'Время исправления (мин)', grow: 0.6 },
	]

	const dataHandler = (data: IDefectTime[]) => {
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
				Время исправление брака
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
