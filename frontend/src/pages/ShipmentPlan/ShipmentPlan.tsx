import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Divider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import { useGetShipmentPlanByDayQuery, useSaveShipmentPlanMutation } from '@/store/api/shipmentPlan'
import type { IShipmentPlan, IShipmentPlanDTO } from '@/types/shipment'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

const emptyData = [
	{ id: '1', product: 'СНП', count: 0, money: 0 },
	{ id: '2', product: 'ПУТГ', count: 0, money: 0 },
	{ id: '3', product: 'ПУТГм', count: 0, money: 0 },
	{ id: '4', product: 'Кольца', count: 0, money: 0 },
	{ id: '5', product: 'Набивка', count: 0, money: 0 },
	{ id: '6', product: 'Спец. арматура', count: 0, money: 0 },
]

export default function ShipmentPlan() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)
	const date = useAppSelector(state => state.criterions.date)

	const [ready, setReady] = useState(false)

	const [table, setTable] = useState<IShipmentPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const columns: Column<IShipmentPlan>[] = [
		{ ...keyColumn<IShipmentPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{ ...keyColumn<IShipmentPlan, 'count'>('count', intColumn), title: 'Отгрузка в штуках' },
		{ ...keyColumn<IShipmentPlan, 'money'>('money', floatColumn), title: 'Отгрузка в деньгах' },
	]

	const { data: shipment } = useGetShipmentPlanByDayQuery(date, { skip: !date })
	const [saveShipment] = useSaveShipmentPlanMutation()

	useEffect(() => {
		if (shipment && shipment.data) {
			setTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const d = shipment.data.find(s => s.product == temp[i].product)
					if (!d) return temp
					temp[i] = { ...temp[i], id: d.id, count: +(d.count || '0'), money: +(d.money || '0') }
				}
				return temp
			})
		} else {
			setTable(emptyData)
		}
	}, [shipment])

	const tableHandler = (data: IShipmentPlan[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		const shipment: IShipmentPlanDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			shipment.push({
				id: '',
				day: date,
				product: e.product || '',
				count: e.count?.toString() || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			await saveShipment(shipment).unwrap()
			setReady(true)
		} catch (error) {
			console.error('rejected', error)
		}
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

			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} lockRows />

			<Button variant='outlined' onClick={submitHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>

			<Divider sx={{ marginTop: 'auto' }} />

			<StepButtons finish={!(skipped.length - 1)} next={nextHandler} prev={prevHandler} />
		</Container>
	)
}
