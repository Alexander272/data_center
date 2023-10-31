import { FC } from 'react'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'

// const getSkippedDays = () => {
// 	const d = new Date()

// 	const y = d.getFullYear()
// 	const m = d.getMonth()

// 	const firstDayOfMonth = new Date(y, m, 7).getDay()
// 	const lastDateOfMonth = new Date(y, m + 1, 0).getDate()
// 	// const lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

// 	// console.log(firstDayOfMonth)
// 	// console.log(lastDateOfMonth)
// 	// console.log(lastDayOfLastMonth)

// 	// console.log(data)

// 	return { skip: firstDayOfMonth, daysCount: lastDateOfMonth }
// }

// interface Data {
// 	day: string
// 	status: ('good' | 'bad' | 'middle')[]
// }

export interface IData {
	type: 'good' | 'bad' | 'middle'
}

export interface IDays {
	date: string
	data: IData[]
}

const DaysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const backgrounds = {
	good: '#23b34273',
	bad: '#ff2d2d73',
	middle: '#daff0e73',
}

type Props = {
	data: IDays[]
}

export const Calendar: FC<Props> = ({ data }) => {
	// const { skip, daysCount } = getSkippedDays()

	// const renderTable = () => {
	// 	const days: JSX.Element[] = []
	// 	let status: ('good' | 'bad' | 'middle')[] = []

	// 	let index = 0
	// 	for (let i = 1; i <= daysCount; i++) {
	// 		if (index < data.length && data[index].day == i.toString()) {
	// 			status = data[index].status
	// 			index++
	// 		} else {
	// 			status = []
	// 		}

	// 		days.push(
	// 			<Grid
	// 				key={i}
	// 				item
	// 				xs={1}
	// 				position={'relative'}
	// 				width={'58px'}
	// 				height={'58px'}
	// 				sx={{
	// 					backgroundColor: '#fff',
	// 					border: '1px solid var(--blue-border)',
	// 					display: 'flex',
	// 					flexDirection: 'column',
	// 				}}
	// 			>
	// 				<Typography
	// 					position={'relative'}
	// 					zIndex={5}
	// 					sx={{
	// 						fontWeight: i == new Date().getDate() ? 'bold' : 'normal',
	// 						fontSize: i == new Date().getDate() ? '1.3rem' : '1rem',
	// 						position: 'absolute',
	// 						top: '50%',
	// 						left: '50%',
	// 						transform: 'translate(-50%, -50%)',
	// 					}}
	// 				>
	// 					{i}
	// 				</Typography>

	// 				{status.map((s, i) => (
	// 					<Cell key={s + i.toString()} status={s} />
	// 				))}
	// 			</Grid>
	// 		)
	// 	}

	// 	return days
	// }

	const start = dayjs().startOf('M')

	const renderDays = () => {
		const days = []
		let j = 0

		for (let i = 0; i < start.endOf('M').date(); i++) {
			let d: IData[] = []
			const day = start.add(i, 'd')
			if (data[j]?.date == day.format('DD.MM.YYYY')) {
				d = data[j].data
				j++
			}

			days.push(
				<Box
					key={i}
					border={'2px solid transparent'}
					borderRadius={'10px'}
					display={'flex'}
					flexDirection={'column'}
					// justifyContent={'center'}
					// alignItems={'center'}
					height={54}
					width={54}
					position={'relative'}
					overflow={'hidden'}
				>
					<Typography
						position={'absolute'}
						top={'50%'}
						left={'50%'}
						fontWeight={day.format('DD.MM.YYYY') == dayjs().format('DD.MM.YYYY') ? 'bold' : 'normal'}
						// fontSize={'1.2rem'}
						fontSize={day.format('DD.MM.YYYY') == dayjs().format('DD.MM.YYYY') ? '24px' : '1.2rem'}
						sx={{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
					>
						{i + 1}
					</Typography>

					{d.map((d, i) => (
						<Box key={i} flexGrow={1} sx={{ backgroundColor: backgrounds[d.type], cursor: 'pointer' }} />
					))}
					{/* //TODO добавить каждому элементу tooltip с кастомным выводом данных */}
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
		// <Grid container columns={7} sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.32)' }}>

		// 	<Grid item xs={start.day()} />
		// 	{renderTable()}
		// </Grid>
	)
}
