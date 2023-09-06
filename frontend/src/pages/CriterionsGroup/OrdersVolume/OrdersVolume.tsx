import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn } from 'react-datasheet-grid'
import { Button, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetOrdersVolumeByDayQuery,
	useSaveOrdersVolumeMutation,
	useUpdateOrdersVolumeMutation,
} from '@/store/api/ordersVolume'
import type { IOrdersVolume, IOrdersVolumeDTO } from '@/types/orderVolume'

const emptyData = [{ id: '1', numberOfOrders: null, sumMoney: null, quantity: null }]

export default function OrdersVolume() {
	const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [table, setTable] = useState<IOrdersVolume[]>(emptyData)

	const dispatch = useAppDispatch()

	const columns: Column<IOrdersVolume>[] = [
		{ ...keyColumn<IOrdersVolume, 'numberOfOrders'>('numberOfOrders', intColumn), title: 'Количество заказов' },
		{ ...keyColumn<IOrdersVolume, 'sumMoney'>('sumMoney', floatColumn), title: 'Сумма заказов' },
		{ ...keyColumn<IOrdersVolume, 'quantity'>('quantity', intColumn), title: 'Количество единиц продукции' },
	]

	const { data: orders } = useGetOrdersVolumeByDayQuery(date, { skip: !date })
	const [saveOrders] = useSaveOrdersVolumeMutation()
	const [updateOrders] = useUpdateOrdersVolumeMutation()

	useEffect(() => {
		if (orders && orders.data) {
			setTable([
				{
					id: orders.data[0].id,
					numberOfOrders: orders.data[0].numberOfOrders,
					sumMoney: +(orders.data[0].sumMoney || '0'),
					quantity: orders.data[0].quantity,
				},
			])
		} else {
			setTable(emptyData)
		}
	}, [orders])

	const tableHandler = (data: IOrdersVolume[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		const order: IOrdersVolumeDTO = {
			id: '',
			day: date,
			numberOfOrders: table[0].numberOfOrders || 0,
			sumMoney: table[0].sumMoney?.toString() || '0',
			quantity: table[0].quantity || 0,
		}

		if (!table[0].numberOfOrders || !table[0].sumMoney || !table[0].quantity) {
			// TODO выводить ошибку
			return
		}

		try {
			if (!orders?.data) {
				await saveOrders(order).unwrap()
				dispatch(setComplete(active))
			} else {
				await updateOrders(order).unwrap()
			}
		} catch (error) {
			// TODO выводить ошибку
			console.error('rejected', error)
		}
	}

	return (
		<>
			<Typography variant='h5' textAlign='center'>
				Ежедневный объем заказов переданных в производство
			</Typography>

			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} lockRows />

			<Button variant='outlined' onClick={submitHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>
		</>
	)
}
