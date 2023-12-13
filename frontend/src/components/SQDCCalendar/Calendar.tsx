import { FC } from 'react'
import { Box, Tooltip, Typography, Zoom, tooltipClasses } from '@mui/material'
import dayjs from 'dayjs'
import type { ISQDC, ISQDCData } from '@/types/sheet'
import { TooltipData } from './TooltipData'

// export interface IData {
// 	type: 'good' | 'bad' | 'middle'
// 	values?: string[]
// }

// export interface IDays {
// 	date: string
// 	data: IData[]
// }

const DaysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const backgrounds = {
	good: '#23b34273',
	bad: '#ff2d2d73',
	middle: '#daff0e73',
}

type Props = {
	data: ISQDC[]
}

export const Calendar: FC<Props> = ({ data }) => {
	const start = dayjs().startOf('M')

	const renderDays = () => {
		const days = []
		let j = 0

		for (let i = 0; i < start.endOf('M').date(); i++) {
			let d: ISQDCData[] = []
			const day = start.add(i, 'd')
			if (data[j]?.date == day.format('DD.MM.YYYY')) {
				d = data[j].data
				j++
			}

			const curDay = day.format('DD.MM.YYYY')
			const today = dayjs().format('DD.MM.YYYY')

			days.push(
				<Box
					key={i}
					border={'2px solid transparent'}
					borderRadius={'10px'}
					display={'flex'}
					flexDirection={'column'}
					height={54}
					width={54}
					position={'relative'}
					overflow={'hidden'}
				>
					<Typography
						position={'absolute'}
						top={'50%'}
						left={'50%'}
						fontWeight={curDay == today ? 'bold' : 'normal'}
						fontSize={curDay == today ? '1.5rem' : '1.2rem'}
						sx={{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
					>
						{i + 1}
					</Typography>

					{d.map((d, i) => (
						<Tooltip
							key={i}
							title={<TooltipData values={d.values} />}
							TransitionComponent={Zoom}
							enterDelay={1500}
							slotProps={{
								popper: {
									sx: {
										[`& .${tooltipClasses.tooltip}`]: {
											backgroundColor: '#ffffff',
											color: 'rgba(0, 0, 0, 0.87)',
											border: '1px solid #dadde9',
											paddingX: 2.5,
											paddingY: 1.5,
											borderRadius: 3,
										},
									},
								},
							}}
						>
							<Box
								key={i}
								flexGrow={1}
								sx={{ backgroundColor: backgrounds[d.type], cursor: 'pointer' }}
							/>
						</Tooltip>
					))}
				</Box>
			)
		}

		return days
	}

	return (
		<Box
			display={'grid'}
			gridTemplateColumns={'repeat(7, 1fr)'}
			padding={0.5}
			borderRadius={'12px'}
			boxShadow={'0px 2px 8px rgba(0,0,0,0.32)'}
		>
			{DaysOfWeek.map(d => (
				<Box
					key={d}
					border={'2px solid transparent'}
					borderRadius={'100%'}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					height={54}
					width={54}
				>
					<Typography fontWeight={'bold'} fontSize={'1.2rem'}>
						{d}
					</Typography>
				</Box>
			))}

			<Box gridColumn={(start.day() + 6) % 7} />
			{renderDays()}
		</Box>
	)
}
