import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { XAXisOption, YAXisOption, TooltipOption } from 'echarts/types/dist/shared.js'

import type { IQuality } from '@/types/quality'
import { BarChart } from '../../components/BarChart/Bar'

type Props = {
	data: IQuality[]
}

const tooltip: TooltipOption = {
	trigger: 'axis',
	axisPointer: {
		type: 'shadow',
	},
}

export default function Putgm({ data }: Props) {
	const table = new Map<string, IQuality>()
	data.forEach(d => {
		if (table.has(d.title)) {
			const item: IQuality = table.get(d.title)!
			table.set(d.title, {
				...item,
				number: item.number + d.number,
				time: item.time + d.time,
			})
		} else {
			table.set(d.title, d)
		}
	})

	const keys = Array.from(table.keys()).reverse()
	const yAxis: YAXisOption = {
		type: 'category',
		data: keys,
	}
	const xAxis: XAXisOption = {
		type: 'value',
		boundaryGap: [0, 0.01],
	}

	const numbers: number[] = []
	const times: number[] = []
	keys.forEach(k => {
		numbers.push(table.get(k)?.number || 0)
		times.push(table.get(k)?.time || 0)
	})

	return (
		<>
			<Stack mt={4}>
				<Box width={'70%'} ml={'auto'} mr={'auto'}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Вид брака</TableCell>
								<TableCell align='right'>Количество брака, шт.</TableCell>
								<TableCell align='right'>Время исправления, мин.</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{Array.from(table.keys()).map(key => (
								<TableRow key={table.get(key)?.id}>
									<TableCell>{table.get(key)?.title}</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(table.get(key)?.number || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(table.get(key)?.time || 0))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>

				<Box height={600} mt={2}>
					<BarChart
						data={{
							series: [
								{ name: 'Количество брака, шт.', data: numbers, emphasis: {}, silent: true },
								{ name: 'Время исправления, мин.', data: times, emphasis: {}, silent: true },
							],
							xAxis,
							yAxis,
							tooltip,
						}}
					/>
				</Box>
			</Stack>
		</>
	)
}
