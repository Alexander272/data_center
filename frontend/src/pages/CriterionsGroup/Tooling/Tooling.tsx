import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, intColumn, keyColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'

import type { ITooling, IToolingDTO } from '@/types/tooling'
import type { IResError } from '@/types/err'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useCreateToolingMutation, useGetToolingByPeriodQuery, useUpdateToolingMutation } from '@/store/api/tooling'
import { setComplete } from '@/store/criterions'
import { type IToast, Toast } from '@/components/Toast/Toast'

const emptyData: ITooling[] = [{ id: '1', request: null, done: null, progress: null }]

export default function Tooling() {
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	const [table, setTable] = useState<ITooling[]>(emptyData)

	const dispatch = useAppDispatch()

	const countPaste = (values: string[]) => {
		return values.map(v => v.replace(' ', ''))
	}

	const columns: Column<ITooling>[] = [
		{
			...keyColumn<ITooling, 'request'>('request', intColumn),
			title: 'Поступило заявок',
			prePasteValues: countPaste,
		},
		{
			...keyColumn<ITooling, 'done'>('done', intColumn),
			title: 'Выполнено',
			prePasteValues: countPaste,
		},
	]

	const { data: tooling } = useGetToolingByPeriodQuery({ from: date }, { skip: !date })
	const [save, { isLoading: saveLoading }] = useCreateToolingMutation()
	const [update, { isLoading: updateLoading }] = useUpdateToolingMutation()

	useEffect(() => {
		if (tooling && tooling.data.length) {
			setTable([
				{
					id: tooling.data[0].id,
					request: +(tooling.data[0].request || '0'),
					done: +(tooling.data[0].done || '0'),
					progress: +(tooling.data[0].progress || '0'),
				},
			])
		} else {
			setTable(emptyData)
		}
	}, [tooling])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: ITooling[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table[0].request == null || table[0].done == null) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newData: IToolingDTO = {
			id: table[0].id || '',
			date: +date,
			request: +table[0].request,
			done: +table[0].done,
		}

		try {
			if (!tooling?.data.length) {
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
				Производство оснастки
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
