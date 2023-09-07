import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetProductionPlanByPeriodQuery,
	useSaveProductionPlanMutation,
	useUpdateProductionPlanMutation,
} from '@/store/api/productionPlan'
import type { IProductionPlan, IProductionPlanDTO } from '@/types/productionPlan'

const emptyData: IProductionPlan[] = [
	{ id: '1', product: 'СНП', money: null },
	{ id: '2', product: 'ПУТГ', money: null },
	{ id: '3', product: 'ПУТГм', money: null },
	{ id: '4', product: 'Кольца', money: null },
	{ id: '5', product: 'Набивка', money: null },
	{ id: '6', product: 'Спец. арматура', money: null },
	{ id: '7', product: 'Прочее', money: null },
]

export default function ProductionPlan() {
	const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [table, setTable] = useState<IProductionPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const columns: Column<IProductionPlan>[] = [
		{ ...keyColumn<IProductionPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{ ...keyColumn<IProductionPlan, 'money'>('money', floatColumn), title: 'Отгрузка в деньгах' },
	]

	const { data: plan } = useGetProductionPlanByPeriodQuery({ from: date }, { skip: !date })
	const [savePlan] = useSaveProductionPlanMutation()
	const [updatePlan] = useUpdateProductionPlanMutation()

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
		if (table.some(t => !t.money)) {
			console.log('empty')
			// TODO выводить ошибку
			return
		}

		const newPlan: IProductionPlanDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newPlan.push({
				id: '',
				date: date,
				product: e.product || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			if (!plan?.data) {
				await savePlan(newPlan).unwrap()
				dispatch(setComplete(active))
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
				Ежедневный объем заказов переданных в производство
			</Typography>

			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} lockRows />

			<Button variant='outlined' onClick={submitHandler} sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}>
				Сохранить
			</Button>
		</>
	)
}
