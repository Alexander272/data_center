import { useEffect, useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import { type Column, DataSheetGrid, keyColumn, intColumn, floatColumn } from 'react-datasheet-grid'
import { IToast, Toast } from '@/components/Toast/Toast'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IShippingPlan, IShippingPlanDTO } from '@/types/shippingPlan'
import {
	useCreateShippingPlanMutation,
	useGetShippingPlanByPeriodQuery,
	useUpdateShippingPlanMutation,
} from '@/store/api/shippingPlan'
import { setComplete } from '@/store/criterions'
import { IResError } from '@/types/err'

const emptyData = [{ id: '1', numberOfOrders: null, sumMoney: null, quantity: null }]

export default function ShippingPlan() {
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	const [table, setTable] = useState<IShippingPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const columns: Column<IShippingPlan>[] = [
		{
			...keyColumn<IShippingPlan, 'numberOfOrders'>('numberOfOrders', intColumn),
			title: 'Количество заказов',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IShippingPlan, 'sumMoney'>('sumMoney', floatColumn),
			title: 'Сумма заказов',
			prePasteValues: moneyPaste,
		},
		{
			...keyColumn<IShippingPlan, 'quantity'>('quantity', intColumn),
			title: 'Количество единиц продукции',
			prePasteValues: countPaste,
		},
	]

	const { data: plan } = useGetShippingPlanByPeriodQuery({ from: date }, { skip: !date })
	const [savePlan, { isLoading: saveLoading }] = useCreateShippingPlanMutation()
	const [updatePlan, { isLoading: updateLoading }] = useUpdateShippingPlanMutation()

	useEffect(() => {
		if (plan && plan.data.length) {
			setTable([
				{
					id: plan.data[0].id,
					numberOfOrders: plan.data[0].numberOfOrders,
					sumMoney: +(plan.data[0].sumMoney || '0'),
					quantity: plan.data[0].quantity,
				},
			])
		} else {
			setTable(emptyData)
		}
	}, [plan])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: IShippingPlan[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table[0].numberOfOrders == null || table[0].sumMoney == null || table[0].quantity == null) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newPlan: IShippingPlanDTO = {
			id: table[0].id || '',
			date: +date,
			numberOfOrders: table[0].numberOfOrders || 0,
			sumMoney: table[0].sumMoney?.toString() || '0',
			quantity: table[0].quantity || 0,
		}

		try {
			if (!plan?.data.length) {
				await savePlan(newPlan).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
			} else {
				await updatePlan(newPlan).unwrap()
				setToast({ type: 'success', message: 'Данные обновлены', open: true })
			}
		} catch (error) {
			const fetchError = error as IResError
			setToast({ type: 'error', message: fetchError.data.message, open: true })
		}
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			<Typography variant='h5' textAlign='center'>
				План отгрузки на день, руб
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
