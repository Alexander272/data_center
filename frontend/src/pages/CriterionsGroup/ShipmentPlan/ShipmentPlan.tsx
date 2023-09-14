import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetShipmentPlanByPeriodQuery,
	useSaveShipmentPlanMutation,
	useUpdateShipmentPlanMutation,
} from '@/store/api/shipmentPlan'
import type { IShipmentPlan, IShipmentPlanDTO } from '@/types/shipment'

const emptyData = [
	{ id: '1', product: 'СНП', count: null, money: null },
	{ id: '2', product: 'ПУТГ', count: null, money: null },
	{ id: '3', product: 'ПУТГм', count: null, money: null },
	{ id: '4', product: 'Кольца', count: null, money: null },
	{ id: '5', product: 'Набивка', count: null, money: null },
	{ id: '6', product: 'Спец. арматура', count: null, money: null },
	{ id: '7', product: 'Прочее', count: null, money: null },
]

export default function ShipmentPlan() {
	// const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [table, setTable] = useState<IShipmentPlan[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const columns: Column<IShipmentPlan>[] = [
		{ ...keyColumn<IShipmentPlan, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<IShipmentPlan, 'count'>('count', intColumn),
			title: 'Отгрузка в штуках',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IShipmentPlan, 'money'>('money', floatColumn),
			title: 'Отгрузка в деньгах',
			prePasteValues: moneyPaste,
		},
	]

	const { data: shipment } = useGetShipmentPlanByPeriodQuery({ from: date }, { skip: !date })
	const [saveShipment, { isLoading: saveLoading }] = useSaveShipmentPlanMutation()
	const [updateShipment, { isLoading: updateLoading }] = useUpdateShipmentPlanMutation()

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
		if (table.some(t => t.count == null || t.money == null)) {
			console.log('empty')
			// TODO выводить ошибку
			return
		}

		const newShipment: IShipmentPlanDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newShipment.push({
				id: '',
				day: date,
				product: e.product || '',
				count: e.count?.toString() || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			if (!shipment?.data) {
				await saveShipment(newShipment).unwrap()
				// dispatch(setComplete(active))
				dispatch(setComplete())
			} else {
				await updateShipment(newShipment).unwrap()
			}
		} catch (error) {
			//TODO выводить ошибку
			console.error('rejected', error)
		}
	}

	return (
		<>
			<Typography variant='h5' textAlign='center'>
				Выполнение плана отгрузок
			</Typography>

			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} lockRows disableExpandSelection />

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
