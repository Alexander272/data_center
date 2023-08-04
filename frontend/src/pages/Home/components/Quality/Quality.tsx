import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material'
import { Cell, LabelList, Pie, PieChart, PieLabelRenderProps } from 'recharts'

const data = [
	{ name: 'СНП', value: 0.07 },
	{ name: 'ПУТГ', value: 0.15 },
	{ name: 'Кольца', value: 0.03 },
	{ name: 'Набивка', value: 0.09 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Quality() {
	return (
		<Box display={'flex'} flexDirection={'column'}>
			<ButtonGroup sx={{ backgroundColor: '#fff', borderRadius: '16px', margin: '8px auto 16px' }}>
				<Button sx={{ borderRadius: '16px' }} disabled>
					Неделя
				</Button>
				<Button>Месяц</Button>
				<Button sx={{ borderRadius: '16px' }}>Квартал</Button>
			</ButtonGroup>

			<Stack direction={'row'} justifyContent={'space-around'}>
				<Box>
					<Typography textAlign={'center'}>Объем исправимого брака в производстве</Typography>

					<PieChart width={340} height={220}>
						<Pie
							data={data}
							dataKey='value'
							cx='50%'
							cy='50%'
							fill='#8884d8'
							outerRadius={90}
							// label={({ x, y, index }: PieLabelRenderProps) => (
							// 	<text x={x} y={y} textAnchor={'middle'} dominantBaseline='central'>
							// 		{data[index as number].name} - {data[index as number].value}
							// 	</text>
							// )}
							label
						>
							{data.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}

							<LabelList dataKey='name' position='top' />
						</Pie>
					</PieChart>
				</Box>

				<Box>
					<Typography textAlign={'center'}>Доля неисправимой продукции</Typography>

					<PieChart width={340} height={220}>
						<Pie
							data={data}
							dataKey='value'
							cx='50%'
							cy='50%'
							fill='#8884d8'
							outerRadius={90}
							label={({ x, y, index }: PieLabelRenderProps) => (
								<text x={x} y={y} textAnchor={'middle'} dominantBaseline='central'>
									{data[index as number].name} - {data[index as number].value}
								</text>
							)}
							// label
						>
							{data.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}

							{/* <LabelList dataKey='name' position='top' /> */}
						</Pie>
					</PieChart>
				</Box>
			</Stack>
		</Box>
	)
}
