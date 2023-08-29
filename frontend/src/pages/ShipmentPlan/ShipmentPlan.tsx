import { useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Divider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IShipmentPlan } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

export default function ShipmentPlan() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [ready, setReady] = useState(false)

	const [data, setData] = useState<IShipmentPlan[]>([
		{ id: '1', product: 'СНП', count: null, money: null },
		{ id: '2', product: 'ПУТГ', count: null, money: null },
		{ id: '3', product: 'ПУТГм', count: null, money: null },
		{ id: '4', product: 'Кольца', count: null, money: null },
		{ id: '5', product: 'Набивка', count: null, money: null },
		{ id: '6', product: 'Спец. арматура', count: null, money: null },
	])

	const dispatch = useAppDispatch()

	const columns: Column<IShipmentPlan>[] = [
		{ ...keyColumn<IShipmentPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{ ...keyColumn<IShipmentPlan, 'count'>('count', intColumn), title: 'Отгрузка в штуках' },
		{ ...keyColumn<IShipmentPlan, 'money'>('money', floatColumn), title: 'Отгрузка в деньгах' },
	]

	const dataHandler = (data: IShipmentPlan[]) => {
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

		if (ready) dispatch(setComplete(active))
		if (idx <= skipped.length - 1) dispatch(setActive(skipped[idx + 1]))
	}

	const prevHandler = () => {
		console.log('prev')
	}

	return (
		<Container>
			<Typography variant='h5' textAlign='center'>
				Выполнение плана отгрузок
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
