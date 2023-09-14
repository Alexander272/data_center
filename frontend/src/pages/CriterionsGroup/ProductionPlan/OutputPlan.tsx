import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetProductionPlanByPeriodQuery,
	useSaveProductionPlanMutation,
	useUpdateProductionPlanMutation,
} from '@/store/api/productionPlan'
import type { IProductionPlan, IProductionPlanDTO } from '@/types/productionPlan'

const emptyData: IProductionPlan[] = [
	{ id: '1', product: 'СНП', quantity: null, money: null },
	{ id: '2', product: 'ПУТГ', quantity: null, money: null },
	{ id: '3', product: 'ПУТГм', quantity: null, money: null },
	{ id: '4', product: 'Кольца', quantity: null, money: null },
	{ id: '5', product: 'Набивка', quantity: null, money: null },
	{ id: '6', product: 'Спец. арматура', quantity: null, money: null },
	{ id: '7', product: 'Прочее', quantity: null, money: null },
]

export default function OutputPlan() {
	const date = useAppSelector(state => state.criterions.date)

	const [table, setTable] = useState<IProductionPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const columns: Column<IProductionPlan>[] = [
		{ ...keyColumn<IProductionPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<IProductionPlan, 'quantity'>('quantity', intColumn),
			title: 'Выпуск в штуках',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IProductionPlan, 'money'>('money', floatColumn),
			title: 'Выпуск в деньгах',
			prePasteValues: moneyPaste,
		},
	]

	const { data: plan } = useGetProductionPlanByPeriodQuery(
		{ period: { from: date }, type: 'output' },
		{ skip: !date }
	)
	const [savePlan, { isLoading: saveLoading }] = useSaveProductionPlanMutation()
	const [updatePlan, { isLoading: updateLoading }] = useUpdateProductionPlanMutation()

	useEffect(() => {
		if (plan && plan.data) {
			setTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const d = plan.data.find(s => s.product == temp[i].product)
					if (!d) return temp
					temp[i] = { ...temp[i], id: d.id, product: d.product, money: +(d.money || '0') }
				}
				return temp
			})
		} else {
			setTable(emptyData)
		}
	}, [plan])

	const tableHandler = (data: IProductionPlan[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table.some(t => t.money == null || t.quantity == null)) {
			console.log('empty')
			// TODO выводить ошибку
			return
		}

		const newPlan: IProductionPlanDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newPlan.push({
				id: '',
				type: 'output',
				date: date,
				product: e.product || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			if (!plan?.data) {
				await savePlan(newPlan).unwrap()
				dispatch(setComplete())
				// dispatch(setComplete(active))
			} else {
				await updatePlan(newPlan).unwrap()
			}
		} catch (error) {
			//TODO выводить ошибку
			console.error('rejected', error)
		}
	}

	return (
		<>
			<Typography variant='h5' textAlign='center'>
				План выпуска на день, руб
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