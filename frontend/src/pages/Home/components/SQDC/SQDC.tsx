import { Stack } from '@mui/material'
import Secure from './Secure'
// import { Brigade } from './Brigade'
// import { Products } from './Products'

export default function SQDC() {
	return (
		<Stack direction={'row'} spacing={3} width={'100%'} justifyContent={'space-around'}>
			<Secure />
			{/* <Brigade />
			<Products /> */}
		</Stack>
	)
}
