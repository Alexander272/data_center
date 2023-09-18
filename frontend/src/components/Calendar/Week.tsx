import { FC } from 'react'
import { Box, Stack } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

type Props = {
	startWeek: Dayjs
	selected: string | string[]
	currentMonth: number
	picker?: 'day' | 'week' | 'month' | 'year'
}

export const Week: FC<Props> = ({ startWeek, selected, currentMonth, picker }) => {
	const isSelected =
		selected[0] == startWeek.format('DD.MM.YYYY') && selected[1] == startWeek.add(6, 'd').format('DD.MM.YYYY')

	const renderWeek = () => {
		const week = []

		for (let i = 0; i < 7; i++) {
			const day = startWeek.add(i, 'd')

			week.push(
				<Box
					key={day.format('DD.MM.YYYY')}
					data-day={day.format('DD.MM.YYYY')}
					border={'2px solid transparent'}
					// borderRadius={'100%'}
					borderRadius={'10px'}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					// maxWidth={40}
					height={38}
					width={38}
					margin={'1px'}
					fontWeight={day.format('DD.MM.YYYY') == dayjs().format('DD.MM.YYYY') ? 'bold' : 'normal'}
					fontSize={day.format('DD.MM.YYYY') == dayjs().format('DD.MM.YYYY') ? '20px' : '1rem'}
					sx={{
						opacity: currentMonth != day.month() ? 0.5 : 1,
						// pointerEvents: currentMonth != day.month() ? 'none' : 'all',
						cursor: 'pointer',
						backgroundColor: selected == day.format('DD.MM.YYYY') ? 'var(--dark-blue)' : 'transparent',
						color: selected == day.format('DD.MM.YYYY') ? '#fff' : 'inherit',
						transition: 'background-color .4s ease-in-out',
						':hover': {
							backgroundColor:
								picker == 'day'
									? selected == day.format('DD.MM.YYYY')
										? 'var(--dark-blue)'
										: 'var(--blue-border)'
									: 'transparent',
						},
					}}
				>
					{day.date()}
				</Box>
			)
		}

		return week
	}

	return (
		<Stack
			direction={'row'}
			sx={{
				borderRadius: '10px',
				transition: 'background-color .4s ease-in-out',
				backgroundColor: isSelected ? 'var(--dark-blue)' : 'transparent',
				color: isSelected ? '#fff' : 'inherit',
				':hover': {
					backgroundColor:
						picker == 'week' ? (isSelected ? 'var(--dark-blue)' : 'var(--blue-border)') : 'transparent',
				},
			}}
		>
			{renderWeek()}
		</Stack>
	)
}
