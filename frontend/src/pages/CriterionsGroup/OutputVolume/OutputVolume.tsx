import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setComplete } from '@/store/criterions'
import {
	useGetOutputVolumeByPeriodQuery,
	useSaveOutputVolumeMutation,
	useUpdateOutputVolumeMutation,
} from '@/store/api/outputVolume'
import type { IOutputVolume, IOutputVolumeDTO } from '@/types/outputVolume'
import type { IResError } from '@/types/err'
import { IToast, Toast } from '@/components/Toast/Toast'

const emptyData: IOutputVolume[] = [
	{ id: '1', product: 'СНП', count: null, money: null },
	{ id: '2', product: 'ПУТГ', count: null, money: null },
	{ id: '3', product: 'ПУТГм', count: null, money: null },
	{ id: '4', product: 'Кольца', count: null, money: null },
	{ id: '5', product: 'Набивка', count: null, money: null },
	{ id: '6', product: 'Спец. арматура', count: null, money: null },
	{ id: '7', product: 'Прочее', count: null, money: null },
]

export default function OutputVolume() {
	// const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	const [stockTable, setStockTable] = useState<IOutputVolume[]>(emptyData)
	const [orderTable, setOrderTable] = useState<IOutputVolume[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const moneyPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}

	const stockColumns: Column<IOutputVolume>[] = [
		{ ...keyColumn<IOutputVolume, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<IOutputVolume, 'count'>('count', intColumn),
			title: 'Объем выпуска продукции в штуках',
			prePasteValues: countPaste,
		},
	]
	const orderColumns: Column<IOutputVolume>[] = [
		{ ...keyColumn<IOutputVolume, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<IOutputVolume, 'count'>('count', intColumn),
			title: 'Объем выпуска продукции в штуках',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IOutputVolume, 'money'>('money', floatColumn),
			title: 'Объем выпуска продукции в деньгах',
			prePasteValues: moneyPaste,
		},
	]

	const { data: output } = useGetOutputVolumeByPeriodQuery({ from: date }, { skip: !date })
	const [saveOutput, { isLoading: saveLoading }] = useSaveOutputVolumeMutation()
	const [updateOutput, { isLoading: updateLoading }] = useUpdateOutputVolumeMutation()

	useEffect(() => {
		if (output && output.data.length) {
			setStockTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const d = output.data.find(s => s.product == temp[i].product && s.forStock)
					if (!d) continue
					temp[i] = { ...temp[i], id: d.id, count: +(d.count || '0'), money: +(d.money || '0') }
				}
				return temp
			})
			setOrderTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const d = output.data.find(s => s.product == temp[i].product && !s.forStock)
					if (!d) continue
					temp[i] = { ...temp[i], id: d.id, count: +(d.count || '0'), money: +(d.money || '0') }
				}
				return temp
			})
		} else {
			setStockTable(emptyData)
			setOrderTable(emptyData)
		}
	}, [output])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const stockTableHandler = (data: IOutputVolume[]) => {
		setStockTable(data)
	}
	const orderTableHandler = (data: IOutputVolume[]) => {
		setOrderTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (stockTable.some(t => t.count == null)) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}
		if (orderTable.some(t => t.count == null || t.money == null)) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newOutput: IOutputVolumeDTO[] = []
		for (let i = 0; i < stockTable.length; i++) {
			const e = stockTable[i]
			newOutput.push({
				id: '',
				date: +date,
				forStock: true,
				product: e.product || '',
				count: e.count?.toString() || '',
				money: e.money?.toString() || '',
			})
		}
		for (let i = 0; i < orderTable.length; i++) {
			const e = orderTable[i]
			newOutput.push({
				id: '',
				date: +date,
				forStock: false,
				product: e.product || '',
				count: e.count?.toString() || '',
				money: e.money?.toString() || '',
			})
		}

		try {
			if (!output?.data.length) {
				await saveOutput(newOutput).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
				// dispatch(setComplete(active))
			} else {
				await updateOutput(newOutput).unwrap()
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
				Ежедневный объем выпуска продукции (на склад)
			</Typography>

			<DataSheetGrid value={stockTable} columns={stockColumns} onChange={stockTableHandler} lockRows />

			{/* <Divider /> */}

			<Typography variant='h5' textAlign='center'>
				Ежедневный объем выпуска продукции (в заказ)
			</Typography>

			<DataSheetGrid value={orderTable} columns={orderColumns} onChange={orderTableHandler} lockRows />

			{/* <Divider /> */}

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
