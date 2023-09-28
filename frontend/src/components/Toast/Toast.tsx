import { Alert, Snackbar } from '@mui/material'
import { FC } from 'react'

export interface IToast {
	type: 'error' | 'success'
	message: string
	open: boolean
}

type Props = {
	data: IToast
	onClose: () => void
}

export const Toast: FC<Props> = ({ data, onClose }) => {
	return (
		<Snackbar
			open={data.open}
			// autoHideDuration={6000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<Alert onClose={onClose} severity={data.type} sx={{ width: '100%' }}>
				{data.message}
			</Alert>
		</Snackbar>
	)
}
