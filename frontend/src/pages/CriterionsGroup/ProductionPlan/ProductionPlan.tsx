import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn } from 'react-datasheet-grid'
import { Button, Divider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setActive, setComplete } from '@/store/criterions'
import type { IProductionPlan } from '@/types/productionPlan'
import { StepButtons } from '@/components/Stepper/StepButtons'
import { Container } from '../Injuries/injuries.style'

const emptyData: IProductionPlan[] = []

export default function ProductionPlan() {
	const active = useAppSelector(state => state.criterions.active)
	const skipped = useAppSelector(state => state.criterions.skipped)
	const date = useAppSelector(state => state.criterions.date)

	const [ready, setReady] = useState(false)

	const [table, setTable] = useState<IProductionPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const columns: Column<IProductionPlan>[] = [
		// { ...keyColumn<IOrdersVolume, 'numberOfOrders'>('numberOfOrders', intColumn), title: 'Количество заказов' },
		// { ...keyColumn<IOrdersVolume, 'sumMoney'>('sumMoney', floatColumn), title: 'Сумма заказов' },
		// { ...keyColumn<IOrdersVolume, 'quantity'>('quantity', intColumn), title: 'Количество единиц продукции' },
	]

	// const { data: orders } = useGetOrdersVolumeByDayQuery(date, { skip: !date })
	// const [saveOrders] = useSaveOrdersVolumeMutation()

	// useEffect(() => {
	// 	if (orders && orders.data) {
	// 		setTable([
	// 			{
	// 				id: orders.data[0].id,
	// 				numberOfOrders: orders.data[0].numberOfOrders,
	// 				sumMoney: +(orders.data[0].sumMoney || '0'),
	// 				quantity: orders.data[0].quantity,
	// 			},
	// 		])
	// 	} else {
	// 		setTable(emptyData)
	// 	}
	// }, [orders])

	const tableHandler = (data: IProductionPlan[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		// const order: IOrdersVolumeDTO = {
		// 	id: '',
		// 	day: date,
		// 	numberOfOrders: table[0].numberOfOrders || 0,
		// 	sumMoney: table[0].sumMoney?.toString() || '0',
		// 	quantity: table[0].quantity || 0,
		// }
		// try {
		// 	await saveOrders(order).unwrap()
		// 	setReady(true)
		// } catch (error) {
		// 	console.error('rejected', error)
		// }
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
				Ежедневный объем заказов переданных в производство
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
