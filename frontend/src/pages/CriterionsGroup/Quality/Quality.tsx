import { SyntheticEvent, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

// import { useAppSelector } from '@/hooks/useStore'
import { IToast, Toast } from '@/components/Toast/Toast'
import { Rings } from './components/Rings'

export default function Quality() {
	const [tab, setTab] = useState('rings')
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
				<Tab label='Кольца' value={'rings'} />
				{/* <Tab label='Item Two' {...a11yProps(1)} />
				<Tab label='Item Three' {...a11yProps(2)} /> */}
			</Tabs>

			{tab === 'rings' && <Rings />}
		</>
	)
}
