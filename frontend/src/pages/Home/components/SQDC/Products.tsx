import { Calendar } from '@/components/Calendar/Calendar'
import { Box, Typography } from '@mui/material'

export const Products = () => {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Объем выпуска продукции
			</Typography>

			<Calendar
				data={[
					{ day: '1', status: ['good'] },
					{ day: '2', status: ['good'] },
					{ day: '3', status: ['bad'] },
				]}
			/>
		</Box>
	)
}
