import { useEffect, useState } from 'react'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
	useGetProductionLoadByPeriodQuery,
	useSaveProductionLoadMutation,
	useUpdateProductionLoadMutation,
} from '@/store/api/productionLoad'
import { setComplete } from '@/store/criterions'
import type { IProductionLoad, IProductionLoadDTO } from '@/types/productionLoad'
import type { IResError } from '@/types/err'
import { IToast, Toast } from '@/components/Toast/Toast'

const emptyData: IProductionLoad[] = [
	{ id: '', sector: 'СНП', days: null, quantity: null },
	{ id: '', sector: 'Прокладки', days: null, quantity: null },
	{ id: '', sector: 'Набивка', days: null, quantity: null },
	{ id: '', sector: 'Кольца', days: null, quantity: null },
	{ id: '', sector: 'Линия прокатки', days: null, quantity: null },
]

export default function ProductionLoad() {
	// const active = useAppSelector(state => state.criterions.active)
	const date = useAppSelector(state => state.criterions.date)

	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	const [table, setTable] = useState<IProductionLoad[]>(emptyData)

	const dispatch = useAppDispatch()

	const columns: Column<IProductionLoad>[] = [
		{ ...keyColumn<IProductionLoad, 'sector'>('sector', textColumn), title: 'Участок', disabled: true },
		{ ...keyColumn<IProductionLoad, 'days'>('days', intColumn), title: 'Загруженность (дней)' },
		{ ...keyColumn<IProductionLoad, 'quantity'>('quantity', intColumn), title: 'Кол-во ед продукции' },
	]

	const { data: load } = useGetProductionLoadByPeriodQuery({ from: date }, { skip: !date })
	const [saveLoad, { isLoading: saveLoading }] = useSaveProductionLoadMutation()
	const [updateLoad, { isLoading: updateLoading }] = useUpdateProductionLoadMutation()

	useEffect(() => {
		if (load && load.data) {
			setTable(prev => {
				const temp = [...prev]
				for (let i = 0; i < temp.length; i++) {
					const d = load.data.find(s => s.sector == temp[i].sector)
					if (!d) return temp
					temp[i] = { ...temp[i], id: d.id, days: +(d.days || '0'), quantity: +(d.quantity || 0) }
				}
				return temp
			})
		} else {
			setTable(emptyData)
		}
	}, [load])

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tableHandler = (data: IProductionLoad[]) => {
		setTable(data)
	}

	const submitHandler = () => {
		void saveHandler()
	}

	const saveHandler = async () => {
		if (table.some(t => t.days == null)) {
			setToast({ type: 'error', message: 'Пустые поля недопустимы. Проверьте заполнение полей', open: true })
			return
		}

		const newLoad: IProductionLoadDTO[] = []
		for (let i = 0; i < table.length; i++) {
			const e = table[i]
			newLoad.push({
				id: '',
				date: date,
				sector: e.sector || '',
				days: e.days || 0,
				quantity: e.quantity || 0,
			})
		}

		try {
			if (!load?.data) {
				await saveLoad(newLoad).unwrap()
				dispatch(setComplete())
				setToast({ type: 'success', message: 'Данные сохранены', open: true })
				// dispatch(setComplete(active))
			} else {
				await updateLoad(newLoad).unwrap()
			}
		} catch (error) {
			setToast({ type: 'error', message: `Произошла ошибка: ${(error as IResError).data.message}`, open: true })
		}
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			<Typography variant='h5' textAlign='center'>
				Загруженность производства по участкам
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
