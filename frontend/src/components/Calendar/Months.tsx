import { FC, MouseEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Dayjs } from 'dayjs'

type Props = {
	date: Dayjs
	onChange: (date: Dayjs) => void
}

const MonthsOfYear = ['Янв', 'Февр', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек']

export const Months: FC<Props> = ({ date, onChange }) => {
	const selectMonth = (event: MouseEvent<HTMLParagraphElement>) => {
		const { index } = (event.target as HTMLParagraphElement).dataset
		if (!index) return
		onChange(date.set('M', +index))
	}

	return (
		<Stack
			direction={'row'}
			flexWrap={'wrap'}
			gap={1}
			height={300}
			padding={1}
			sx={{ backgroundColor: '#fff', pointerEvents: 'all' }}
		>
			{MonthsOfYear.map((m, i) => (
				<Box key={m} flexBasis={'30%'} display={'flex'} alignItems={'center'}>
					<Typography
						data-index={i}
						onClick={selectMonth}
						width={'100%'}
						textAlign={'center'}
						paddingX={2}
						paddingY={1}
						// borderRadius={20}
						borderRadius={'14px'}
						sx={{
							cursor: 'pointer',
							transition: 'background .3s ease-in-out',
							backgroundColor: date.month() == i ? 'var(--dark-blue)' : 'transparent',
							color: date.month() == i ? '#fff' : 'inherit',
							':hover': {
								backgroundColor: date.month() == i ? 'var(--dark-blue)' : 'var(--blue-border)',
							},
						}}
					>
						{m}
					</Typography>
				</Box>
			))}
		</Stack>
	)
}
