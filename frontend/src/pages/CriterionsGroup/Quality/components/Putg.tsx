import { useEffect, useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'

import type { IResError } from '@/types/err'
import type { IQualityDTO } from '@/types/quality'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useCreateQualityMutation, useGetQualityByPeriodQuery, useUpdateQualityMutation } from '@/store/api/quality'
import { setComplete } from '@/store/criterions'
import { IToast, Toast } from '@/components/Toast/Toast'

const empty: IQualityDTO[] = [
	{ count: 1, title: 'Вмятины', number: null, time: null },
	{ count: 2, title: 'Царапины', number: null, time: null },
	{ count: 3, title: 'Брак обтюратора', number: null, time: null },
	{ count: 4, title: 'Несоответствующий размер', number: null, time: null },
	{ count: 5, title: 'Иное', number: null, time: null },
]
const product = 'putg'

export const Putg = () => {
	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	const [table, setTable] = useState<IQualityDTO[]>(empty)

	const date = useAppSelector(state => state.criterions.date)
	const dispatch = useAppDispatch()

	const { data } = useGetQualityByPeriodQuery({ product: product, period: { from: date } }, { skip: !date })
	const [create, { isLoading: createLoading }] = useCreateQualityMutation()
	const [update, { isLoading: updateLoading }] = useUpdateQualityMutation()

	useEffect(() => {
		if (data && data.data.length) setTable(data.data)
		else setTable(empty)
	}, [data])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}
	const floatPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', '').replace(',', '.'))
	}
	const columns: Column<IQualityDTO>[] = [
		{ ...keyColumn<IQualityDTO, 'title'>('title', textColumn), title: 'Вид дефекта', width: 1.5, disabled: true },
		{
			...keyColumn<IQualityDTO, 'number'>('number', intColumn),
			title: 'Количество брака, шт.',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<IQualityDTO, 'time'>('time', floatColumn),
			title: 'Время исправления, мин.',
			prePasteValues: floatPaste,
		},
	]

	const tableHandler = (data: IQualityDTO[]) => {
		setTable(data)
	}

	const saveHandler = async () => {
		const newData: IQualityDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newData.push({
				id: e.id || '',
				date: +date,
				product: product,
				count: i + 1,
				title: e.title || '',
				number: e.number || 0,
				time: e.time || 0,
			})
		}

		try {
			if (!data?.data.length) {
				await create(newData).unwrap()
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
	const submitHandler = () => {
		void saveHandler()
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			{/* <Typography fontSize={'1.2rem'}>Окончательный брак уплотнительных колец</Typography> */}
			<DataSheetGrid value={table} columns={columns} onChange={tableHandler} headerRowHeight={60} lockRows />

			<Button
				variant='outlined'
				onClick={submitHandler}
				disabled={createLoading || updateLoading}
				startIcon={createLoading || updateLoading ? <CircularProgress size={18} /> : null}
				sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}
			>
				Сохранить
			</Button>
		</>
	)
}
