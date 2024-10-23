import { useEffect, useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn } from 'react-datasheet-grid'

import type { ISafetyDTO } from '@/types/safety'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useCreateSafetyMutation, useGetSafetyByPeriodQuery, useUpdateSafetyMutation } from '@/store/api/safety'
import { IToast, Toast } from '@/components/Toast/Toast'
import { setComplete } from '@/store/criterions'
import { IResError } from '@/types/err'

const empty = [{ id: '1', date: 0, violations: null, injuries: null }]

export default function Safety() {
	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	const [table, setTable] = useState<ISafetyDTO[]>(empty)

	const date = useAppSelector(state => state.criterions.date)
	const dispatch = useAppDispatch()

	const { data } = useGetSafetyByPeriodQuery({ from: date }, { skip: !date })
	const [save, { isLoading: saveLoading }] = useCreateSafetyMutation()
	const [update, { isLoading: updateLoading }] = useUpdateSafetyMutation()

	useEffect(() => {
		if (data && data.data.length) setTable(data.data)
		else setTable(empty)
	}, [data])

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}

	const columns: Column<ISafetyDTO>[] = [
		{
			...keyColumn<ISafetyDTO, 'violations'>('violations', intColumn),
			title: 'Количество выявленных нарушений',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<ISafetyDTO, 'injuries'>('injuries', intColumn),
			title: 'Количество травм',
			prePasteValues: countPaste,
		},
	]

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: ISafetyDTO[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}
	const saveHandler = async () => {
		if (table[0].violations == null || table[0].injuries == null) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newData: ISafetyDTO = {
			id: table[0].id || '',
			date: +date,
			violations: +table[0].violations,
			injuries: +table[0].injuries,
		}

		try {
			if (!data?.data.length) {
				await save(newData).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
				// dispatch(setComplete(active))
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
				Безопасность
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
