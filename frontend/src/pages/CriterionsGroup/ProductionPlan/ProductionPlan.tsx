import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetProductionPlanByPeriodQuery,
	useSaveProductionPlanMutation,
	useUpdateProductionPlanMutation,
} from '@/store/api/productionPlan'
import type { IProductionPlan, IProductionPlanDTO } from '@/types/productionPlan'
import type { IResError } from '@/types/err'
import { IToast, Toast } from '@/components/Toast/Toast'

const emptyData: IProductionPlan[] = [
	{ id: '1', product: 'СНП', quantity: null, money: null },
	{ id: '2', product: 'ПУТГ', quantity: null, money: null },
	{ id: '3', product: 'ПУТГм', quantity: null, money: null },
	{ id: '4', product: 'Кольца', quantity: null, money: null },
	{ id: '5', product: 'Набивка', quantity: null, money: null },
	{ id: '6', product: 'Спец. арматура', quantity: null, money: null },
	{ id: '7', product: 'Прочее', quantity: null, money: null },
]

export default function ProductionPlan() {
	// const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	const [table, setTable] = useState<IProductionPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const columns: Column<IProductionPlan>[] = [
		{ ...keyColumn<IProductionPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<IProductionPlan, 'money'>('money', floatColumn),
			title: 'Отгрузка в деньгах',
			prePasteValues: moneyPaste,
		},
	]

	const { data: plan } = useGetProductionPlanByPeriodQuery(
		{ period: { from: date }, type: 'annual' },
		{ skip: !date }
	)
	const [savePlan, { isLoading: saveLoading }] = useSaveProductionPlanMutation()
	const [updatePlan, { isLoading: updateLoading }] = useUpdateProductionPlanMutation()

	useEffect(() => {
		if (plan && plan.data.length) {
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

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: IProductionPlan[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table.some(t => t.money == null)) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newPlan: IProductionPlanDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newPlan.push({
				id: '',
				type: 'annual',
				date: +date,
				product: e.product || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			if (!plan?.data.length) {
				await savePlan(newPlan).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
				// dispatch(setComplete(active))
			} else {
				await updatePlan(newPlan).unwrap()
				setToast({ type: 'success', message: 'Данные обновлены', open: true })
			}
		} catch (error) {
			setToast({ type: 'error', message: (error as IResError).data.message, open: true })
		}
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			<Typography variant='h5' textAlign='center'>
				Годовой план отгрузки на день, руб
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
