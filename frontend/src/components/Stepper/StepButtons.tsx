import { FC } from 'react'
import { Button, Stack } from '@mui/material'

type Props = {
	finish?: boolean
	next: () => void
	prev: () => void
}

export const StepButtons: FC<Props> = ({ finish, next, prev }) => {
	return (
		<Stack spacing={1} direction={'row'} width={300} margin={'0 auto'}>
			<Button onClick={next} variant='contained' fullWidth sx={{ borderRadius: 8 }}>
				{finish ? 'Завершить' : 'Далее'}
			</Button>
			<Button onClick={prev} variant='outlined' fullWidth sx={{ borderRadius: 8 }}>
				Назад
			</Button>
		</Stack>
	)
}
