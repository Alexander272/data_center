import { useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Divider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IOutputVolume } from '@/types/sheet'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

export default function OutputVolume() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)

	const [ready, setReady] = useState(false)

	/*
	
	Дописать названия типов продукции

	приход. просто несколько полей

	загрузка (срок выполнения по видам продукции). тип продукции + кол-во дней

	план отдельный критерий. сумма на день (или на месяц)
	*/

	const [stockData, setStockData] = useState<IOutputVolume[]>([
		{ id: '1', product: 'СНП', count: null, money: null },
		{ id: '2', product: 'ПУТГ', count: null, money: null },
		{ id: '3', product: 'ПУТГм', count: null, money: null },
		{ id: '4', product: 'Кольца', count: null, money: null },
		{ id: '5', product: 'Набивка', count: null, money: null },
		{ id: '6', product: 'Спец. арматура', count: null, money: null },
	])
	const [orderData, setOrderData] = useState<IOutputVolume[]>([
		{ id: '1', product: 'СНП', count: null, money: null },
		{ id: '2', product: 'ПУТГ', count: null, money: null },
		{ id: '3', product: 'ПУТГм', count: null, money: null },
		{ id: '4', product: 'Кольца', count: null, money: null },
		{ id: '5', product: 'Набивка', count: null, money: null },
		{ id: '6', product: 'Спец. арматура', count: null, money: null },
	])

	const dispatch = useAppDispatch()

	const columns: Column<IOutputVolume>[] = [
		{
			...keyColumn<IOutputVolume, 'product'>('product', textColumn),
			title: 'Тип продукции',
			disabled: true,
		},
		{
			...keyColumn<IOutputVolume, 'count'>('count', intColumn),
			title: 'Объем выпуска продукции в штуках',
		},
		{
			...keyColumn<IOutputVolume, 'money'>('money', floatColumn),
			title: 'Объем выпуска продукции в деньгах',
		},
	]

	const stockDataHandler = (data: IOutputVolume[]) => {
		setStockData(data)
	}
	const orderDataHandler = (data: IOutputVolume[]) => {
		setOrderData(data)
	}

	const saveHandler = () => {
		console.log('save')
		setReady(true)
	}

	const nextHandler = () => {
		// TODO стоит это все перенести в компонент
		// TODO по идее это можно закольцевать до тех пор пока остаются не заполненные критерии
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
				Ежедневный объем выпуска продукции (на склад)
			</Typography>

			<DataSheetGrid value={stockData} columns={columns} onChange={stockDataHandler} lockRows />

			<Divider />

			<Typography variant='h5' textAlign='center'>
				Ежедневный объем выпуска продукции (в заказ)
			</Typography>

			<DataSheetGrid value={orderData} columns={columns} onChange={orderDataHandler} lockRows />

			<Divider />

			<Button variant='outlined' onClick={saveHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>

			<Divider />

			<StepButtons finish={!(skipped.length - 1)} next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
