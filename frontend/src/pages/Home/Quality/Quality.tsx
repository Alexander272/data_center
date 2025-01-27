import { lazy, Suspense, SyntheticEvent, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetQualityByPeriodQuery } from '@/store/api/quality'
import { TableFallBack } from '../components/Fallback/FallBack'

// const Rings = lazy(() => import('@/pages/Home/Quality/components/Rings'))
const Snp = lazy(() => import('@/pages/Home/Quality/components/Snp'))
const Putg = lazy(() => import('@/pages/Home/Quality/components/Putg'))
const Putgm = lazy(() => import('@/pages/Home/Quality/components/Putgm'))

export default function Quality() {
	const [tab, setTab] = useState('snp')
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
				{/* <Tab label='Кольца' value={'rings'} /> */}
				<Tab label='СНП' value={'snp'} />
				<Tab label='ПУТГ' value={'putg'} />
				<Tab label='ПУТГм' value={'putgm'} />
			</Tabs>

			{isFetching ? <TableFallBack /> : null}
			<Suspense fallback={<TableFallBack />}>
				{/* {tab == 'rings' && data?.data.length ? <Rings data={data.data} /> : null} */}
				{tab == 'snp' && data?.data.length ? <Snp data={data.data} /> : null}
				{tab == 'putg' && data?.data.length ? <Putg data={data.data} /> : null}
				{tab == 'putgm' && data?.data.length ? <Putgm data={data.data} /> : null}
			</Suspense>

			{!data?.data.length && !isError ? (
				<Typography fontSize={'1.2rem'} textAlign={'center'} mt={2}>
					Для выбранного периода данные не найдены
				</Typography>
			) : null}
			{isError ? (
				<Typography fontSize={'1.2rem'} textAlign={'center'} mt={2}>
					Не удалось получить данные
				</Typography>
			) : null}
		</>
	)
}
