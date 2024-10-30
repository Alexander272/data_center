import { lazy, Suspense, SyntheticEvent, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetQualityByPeriodQuery } from '@/store/api/quality'
import { TableFallBack } from '../components/Fallback/FallBack'

const Rings = lazy(() => import('@/pages/Home/Quality/components/Rings'))

export default function Quality() {
	const [tab, setTab] = useState('rings')
	// const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isFetching, isError } = useGetQualityByPeriodQuery({ product: tab, period }, { skip: !period.from })

	const tabHandler = (_event: SyntheticEvent, newValue: string) => {
		setTab(newValue)
	}

	return (
		<>
			<Tabs
				value={tab}
				onChange={tabHandler}
				sx={{ borderBottom: 1, borderColor: 'divider' }}
				// centered
			>
				<Tab label='Кольца' value={'rings'} />
			</Tabs>

			{isFetching ? <TableFallBack /> : null}
			<Suspense fallback={<TableFallBack />}>
				{tab == 'rings' ? <Rings data={data?.data || []} /> : null}
			</Suspense>

			{!data?.data.length && !isError ? (
				<Typography fontSize={'1.2rem'} textAlign={'center'}>
					Для выбранного периода данные не найдены
				</Typography>
			) : null}
			{isError ? (
				<Typography fontSize={'1.2rem'} textAlign={'center'}>
					Не удалось получить данные
				</Typography>
			) : null}
		</>
	)
}
