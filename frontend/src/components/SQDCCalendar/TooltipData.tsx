import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

type Props = {
	values?: string[]
}

export const TooltipData: FC<Props> = ({ values }) => {
	if (!values || !values.length) return 'Нет данных'

	return (
		<Stack>
			{values?.map((v, i) => (
				<Typography key={i}>
					{i + 1}. {v}
				</Typography>
			))}
		</Stack>
	)
}
