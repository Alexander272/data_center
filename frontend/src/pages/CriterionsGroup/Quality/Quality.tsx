import { SyntheticEvent, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

// import { useAppSelector } from '@/hooks/useStore'
import { IToast, Toast } from '@/components/Toast/Toast'
import { Snp } from './components/Snp'
import { Putg } from './components/Putg'
import { Putgm } from './components/Putgm'

export default function Quality() {
	const [tab, setTab] = useState('snp')
	const [toast, setToast] = useState<IToast>({ type: 'success', message: '', open: false })

	// const date = useAppSelector(state => state.criterions.date)

	const closeHandler = () => {
		setToast({ type: 'success', message: '', open: false })
	}

	const tabHandler = (_event: SyntheticEvent, newValue: string) => {
		setTab(newValue)
	}

	return (
		<>
			<Toast data={toast} onClose={closeHandler} />

			<Typography variant='h5' textAlign='center'>
				Качество
			</Typography>

			{/* //TODO tabs */}
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
				{/* <Tab label='Item Two' {...a11yProps(1)} /> */}
			</Tabs>

			{/* {tab === 'rings' && <Rings />} */}
			{tab === 'snp' && <Snp />}
			{tab === 'putg' && <Putg />}
			{tab === 'putgm' && <Putgm />}
		</>
	)
}
