import { FC, MouseEvent } from 'react'
import { Dayjs } from 'dayjs'
import { Stack, Typography } from '@mui/material'

type Props = {
	date: Dayjs
	selected: Dayjs
	onChange: (date: Dayjs) => void
}

export const Years: FC<Props> = ({ date, selected, onChange }) => {
	const selectYear = (event: MouseEvent<HTMLParagraphElement>) => {
		const { year } = (event.target as HTMLParagraphElement).dataset
		if (!year) return
		onChange(selected.set('y', +year))
	}

	const renderYears = () => {
		const temp = []

		for (let i = 0; i < 6; i++) {
			const d = date.subtract(i, 'y')

			temp.push(
				<Typography
					key={d.year()}
					data-year={d.year()}
					onClick={selectYear}
					width={'100%'}
					textAlign={'center'}
					paddingX={2}
					paddingY={1}
					borderRadius={'14px'}
					sx={{
						cursor: 'pointer',
						transition: 'background .3s ease-in-out',
						backgroundColor: d.year() == selected.year() ? 'var(--dark-blue)' : 'transparent',
						color: d.year() == selected.year() ? '#fff' : 'inherit',
						':hover': {
							backgroundColor: d.year() == selected.year() ? 'var(--dark-blue)' : 'var(--blue-border)',
						},
					}}
				>
					{d.year()}
				</Typography>
			)
		}

		return temp
	}

	return (
		<Stack
			direction={'column-reverse'}
			spacing={0.5}
			height={300}
			padding={2}
			sx={{ backgroundColor: '#fff', pointerEvents: 'all' }}
		>
			{renderYears()}
		</Stack>
	)
}
