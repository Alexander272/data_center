import { Box, Button, ButtonGroup, Stack } from '@mui/material'

export default function Expenses() {
	return (
		<Box display={'flex'} flexDirection={'column'}>
			<ButtonGroup sx={{ backgroundColor: '#fff', borderRadius: '16px', margin: '8px auto 16px' }}>
				<Button sx={{ borderRadius: '16px' }} disabled>
					Неделя
				</Button>
				<Button>Месяц</Button>
				<Button sx={{ borderRadius: '16px' }}>Квартал</Button>
			</ButtonGroup>

			<Stack direction={'row'}></Stack>
		</Box>
	)
}
