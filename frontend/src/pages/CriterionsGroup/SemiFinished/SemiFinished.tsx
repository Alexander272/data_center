import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'

import type { ISemiFinished, ISemiFinishedDTO } from '@/types/semiFinished'
import type { IResError } from '@/types/err'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
	useCreateSemiFinishedMutation,
	useGetSemiFinishedByPeriodQuery,
	useUpdateSemiFinishedMutation,
} from '@/store/api/semiFinished'
import { setComplete } from '@/store/criterions'
import { type IToast, Toast } from '@/components/Toast/Toast'

const emptyData = [
	{ id: '1', product: 'МГЛ', count: null },
	{ id: '2', product: 'Фольга', count: null },
	{ id: '3', product: 'Армированная фольга', count: null },
]

export default function SemiFinished() {
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	const [table, setTable] = useState<ISemiFinished[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}

	const columns: Column<ISemiFinished>[] = [
		{ ...keyColumn<ISemiFinished, 'product'>('product', textColumn), title: 'Тип продукции', disabled: true },
		{
			...keyColumn<ISemiFinished, 'count'>('count', intColumn),
			title: 'Объем выпуска продукции',
			prePasteValues: countPaste,
		},
	]

	const { data: semiFinished } = useGetSemiFinishedByPeriodQuery({ from: date }, { skip: !date })
	const [save, { isLoading: saveLoading }] = useCreateSemiFinishedMutation()
	const [update, { isLoading: updateLoading }] = useUpdateSemiFinishedMutation()

	useEffect(() => {
		if (semiFinished && semiFinished.data.length) {
			setTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const product = semiFinished.data.find(s => s.product == temp[i].product)
					if (!product) return temp
					temp[i] = {
						...temp[i],
						id: product.id,
						count: +(product.count || '0'),
					}
				}
				return temp
			})
		} else {
			setTable(emptyData)
		}
	}, [semiFinished])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: ISemiFinished[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table.some(t => t.count == null)) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newData: ISemiFinishedDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newData.push({
				id: e.id || '',
				date: +date,
				product: e.product || '',
				count: +(e.count || 0),
			})
		}

		try {
			if (!semiFinished?.data.length) {
				await save(newData).unwrap()
				// dispatch(setComplete(active))
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
			} else {
				await update(newData).unwrap()
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
				Производство полуфабрикатов
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
