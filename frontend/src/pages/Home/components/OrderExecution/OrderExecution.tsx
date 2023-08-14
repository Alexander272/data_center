import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material'
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, ComposedChart } from 'recharts'

const data = [
	{ day: '01.07', plan: 600, fact: 550, diff: -50 },
	{ day: '02.07', plan: 600, fact: 750, diff: 150 },
	{ day: '03.07', plan: 600, fact: 650, diff: 50 },
	{ day: '04.07', plan: 600, fact: 500, diff: -100 },
	{ day: '05.07', plan: 600, fact: 600, diff: 0 },
	{ day: '06.07', plan: 600, fact: 590, diff: -10 },
	{ day: '07.07', plan: 600, fact: 620, diff: 20 },
]

export default function OrderExecution() {
	const gradientOffset = () => {
		const dataMax = Math.max(...data.map(i => i.diff))
		const dataMin = Math.min(...data.map(i => i.diff))

		if (dataMax <= 0) {
			return 0
		}
		if (dataMin >= 0) {
			return 1
		}

		return dataMax / (dataMax - dataMin)
	}
	const off = gradientOffset()

	return (
		<Box display={'flex'} flexDirection={'column'}>
			<ButtonGroup sx={{ backgroundColor: '#fff', borderRadius: '16px', margin: '8px auto 16px' }}>
				<Button sx={{ borderRadius: '16px' }} disabled>
					Неделя
				</Button>
				<Button>Месяц</Button>
				<Button sx={{ borderRadius: '16px' }}>Квартал</Button>
			</ButtonGroup>

			<Stack direction={'row'}>
				<Box>
					<Typography>Ежедневный объем заказов на день переданных в производство</Typography>

					<ComposedChart
						width={730}
						height={250}
						data={data}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
								<stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis dataKey='day' />
						<YAxis />
						<CartesianGrid strokeDasharray='3 3' />
						<Tooltip />
						{/* <Area type='monotone' dataKey='plan' stroke='#8884d8' fillOpacity={1} fill='url(#colorUv)' /> */}
						<Area type='monotone' dataKey='fact' stroke='#82ca9d' fillOpacity={1} fill='url(#colorPv)' />
						<Line type='monotone' dataKey='plan' stroke='#8884d8' strokeWidth={2} />
					</ComposedChart>

					<AreaChart
						width={730}
						height={250}
						data={data}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='day' />
						<YAxis />
						<Tooltip />
						<defs>
							<linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
								<stop offset={off} stopColor='green' stopOpacity={0.8} />
								<stop offset={off} stopColor='red' stopOpacity={0.8} />
							</linearGradient>
						</defs>
						<Area type='monotone' dataKey='diff' stroke='#000' fill='url(#splitColor)' />
					</AreaChart>
				</Box>
			</Stack>
		</Box>
	)
}
