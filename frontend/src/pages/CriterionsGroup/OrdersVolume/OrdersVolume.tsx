import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetOrdersVolumeByPeriodQuery,
	useSaveOrdersVolumeMutation,
	useUpdateOrdersVolumeMutation,
} from '@/store/api/ordersVolume'
import type { IOrdersVolume, IOrdersVolumeDTO } from '@/types/orderVolume'
import type { IResError } from '@/types/err'
import { IToast, Toast } from '@/components/Toast/Toast'

const emptyData = [{ id: '1', numberOfOrders: null, sumMoney: null, quantity: null }]

export default function OrdersVolume() {
	// const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	const [table, setTable] = useState<IOrdersVolume[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const columns: Column<IOrdersVolume>[] = [
		{
			...keyColumn<IOrdersVolume, 'numberOfOrders'>('numberOfOrders', intColumn),
			title: 'Количество заказов',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IOrdersVolume, 'sumMoney'>('sumMoney', floatColumn),
			title: 'Сумма заказов',
			prePasteValues: moneyPaste,
		},
		{
			...keyColumn<IOrdersVolume, 'quantity'>('quantity', intColumn),
			title: 'Количество единиц продукции',
			prePasteValues: countPaste,
		},
	]

	const { data: orders } = useGetOrdersVolumeByPeriodQuery({ from: date }, { skip: !date })
	const [saveOrders, { isLoading: saveLoading }] = useSaveOrdersVolumeMutation()
	const [updateOrders, { isLoading: updateLoading }] = useUpdateOrdersVolumeMutation()

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

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

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

		if (table[0].numberOfOrders == null || table[0].sumMoney == null || table[0].quantity == null) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		try {
			if (!orders?.data) {
				await saveOrders(order).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
				// dispatch(setComplete(active))
			} else {
				await updateOrders(order).unwrap()
			}
		} catch (error) {
			setToast({ type: 'error', message: `Произошла ошибка: ${(error as IResError).data.message}`, open: false })
		}
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			<Typography variant='h5' textAlign='center'>
				Ежедневный объем заказов переданных в производство
			</Typography>

			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} lockRows />

			<Button
				variant='outlined'
				onClick={submitHandler}
				disabled={saveLoading || updateLoading}
				startIcon={saveLoading || updateLoading ? <CircularProgress size={18} /> : null}
				sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}
			>
				Сохранить
			</Button>
		</>
	)
}
