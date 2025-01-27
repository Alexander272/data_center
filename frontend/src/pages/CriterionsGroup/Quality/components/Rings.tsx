// import { useEffect, useState } from 'react'
// import { Button, CircularProgress, Typography } from '@mui/material'
// import { Column, DataSheetGrid, floatColumn, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'

// import type { IResError } from '@/types/err'
// import type { IQualityDTO } from '@/types/quality'
// import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
// import { useGetQualityByPeriodQuery, useCreateQualityMutation, useUpdateQualityMutation } from '@/store/api/quality'
// import { IToast, Toast } from '@/components/Toast/Toast'
// import { setComplete } from '@/store/criterions'

// const empty: IQualityDTO[] = [
// 	{ number: 1, title: 'Отслаивание внутр./наруж. ленты от кольца', amount: null, percent: null, cost: null },
// 	{ number: 2, title: 'Поперечные трещины', amount: null, percent: null, cost: null },
// 	{ number: 3, title: 'Отпечатки на поверхности кольца', amount: null, percent: null, cost: null },
// 	{ number: 4, title: 'Прочее', amount: null, percent: null, cost: null },
// ]

export const Rings = () => {
	// const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })
	// const [table, setTable] = useState<IQualityDTO[]>(empty)

	// const date = useAppSelector(state => state.criterions.date)
	// const dispatch = useAppDispatch()

	// const { data } = useGetQualityByPeriodQuery({ product: 'rings', period: { from: date } }, { skip: !date })
	// const [create, { isLoading: createLoading }] = useCreateQualityMutation()
	// const [update, { isLoading: updateLoading }] = useUpdateQualityMutation()

	// useEffect(() => {
	// 	if (data && data.data.length) setTable(data.data)
	// 	else setTable(empty)
	// }, [data])

	// const countPaste = (values: string[]) => {
	// 	return values.map(v => v.replace(' ', ''))
	// }
	// const moneyPaste = (values: string[]) => {
	// 	return values.map(v => v.replace(' ', '').replace(',', '.'))
	// }

	// const columns: Column<IQualityDTO>[] = [
	// 	{ ...keyColumn<IQualityDTO, 'title'>('title', textColumn), title: 'Вид брака', width: 1.5, disabled: true },
	// 	{
	// 		...keyColumn<IQualityDTO, 'amount'>('amount', intColumn),
	// 		title: 'Количество брака, шт.',
	// 		prePasteValues: countPaste,
	// 	},
	// 	{
	// 		...keyColumn<IQualityDTO, 'percent'>('percent', intColumn),
	// 		title: '% брака по видам дефектов от общего кол-ва бракованных колец',
	// 		width: 1.2,
	// 		prePasteValues: countPaste,
	// 	},
	// 	{
	// 		...keyColumn<IQualityDTO, 'cost'>('cost', floatColumn),
	// 		title: 'Затраты, руб.',
	// 		prePasteValues: moneyPaste,
	// 	},
	// ]

	// const tableHandler = (data: IQualityDTO[]) => {
	// 	setTable(data)
	// }

	// const closeHandler = () => {
	// 	setToast({ type: 'success', message: '', open: false })
	// }

	// const saveHandler = async () => {
	// 	// надо написать нормальную проверку, хотя при сохранении нули проставляются, так что пофиг

	// 	const newData: IQualityDTO[] = []
	// 	for (let i = 0; i < table.length; i++) {
	// 		const e = table[i]
	// 		newData.push({
	// 			id: e.id || '',
	// 			date: +date,
	// 			type: 'final',
	// 			product: 'rings',
	// 			number: i + 1,
	// 			title: e.title || '',
	// 			amount: e.amount || 0,
	// 			percent: e.percent || 0,
	// 			cost: e.cost || 0,
	// 		})
	// 	}

	// 	try {
	// 		if (!data?.data.length) {
	// 			await create(newData).unwrap()
	// 			dispatch(setComplete())
	// 			setToast({ type: 'success', message: 'Данные сохранены', open: true })
	// 		} else {
	// 			await update(newData).unwrap()
	// 			setToast({ type: 'success', message: 'Данные обновлены', open: true })
	// 		}
	// 	} catch (error) {
	// 		setToast({ type: 'error', message: (error as IResError).data.message, open: true })
	// 	}
	// }
	// const submitHandler = () => {
	// 	void saveHandler()
	// }

	// return (
	// 	<>
	// 		<Toast data={toast} onClose={closeHandler} />

	// 		<Typography fontSize={'1.2rem'}>Окончательный брак уплотнительных колец</Typography>
	// 		<DataSheetGrid value={table} columns={columns} onChange={tableHandler} headerRowHeight={60} lockRows />

	// 		<Button
	// 			variant='outlined'
	// 			onClick={submitHandler}
	// 			disabled={createLoading || updateLoading}
	// 			startIcon={createLoading || updateLoading ? <CircularProgress size={18} /> : null}
	// 			sx={{ borderRadius: 8, width: 300, margin: '0 auto' }}
	// 		>
	// 			Сохранить
	// 		</Button>
	// 	</>
	// )
	return null
}
