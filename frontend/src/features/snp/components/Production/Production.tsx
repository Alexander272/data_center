import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import { useGetShipmentByPeriodQuery } from '@/store/api/shipment'
import { Fallback } from '@/components/Fallback/Fallback'
import { FormatDate } from '@/constants/format'
import { Line } from '@/pages/Home/components/LineChart/Line'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'

export const Production = () => {
	const [axis, setAxis] = useState<string[]>([])
	const [shipment, setShipment] = useState<ISeriesData>({ name: 'Отгружено', data: [] })
	const [output, setOutput] = useState<ISeriesData>({ name: 'Выпуск в заказы', data: [] })
	const [stoke, setStoke] = useState<ISeriesData>({ name: 'Выпуск на склад', data: [] })

	// const min = useRef(Infinity)

	let date = dayjs().startOf('d').subtract(1, 'd')
	if (date.day() < 3) date = date.subtract(5, 'd')

	// const from = date.startOf('w').unix().toString()
	// const to = date.endOf('w').unix().toString()
	const from = (1729450800).toString()
	const to = (1730055599).toString()

	const { data: shipmentData, isFetching: isFetchShipment } = useGetShipmentByPeriodQuery(
		{ from, to },
		{ skip: !from }
	)
	const { data: outputData, isFetching: isFetchOutput } = useGetOutputVolumeByPeriodQuery(
		{ from, to },
		{ skip: !from }
	)

	useEffect(() => {
		const axisLine = new Set<string>()
		const shipment: number[] = []
		const output: number[] = []
		const stoke: number[] = []

		shipmentData?.data.forEach(d => {
			if (d.product == 'СНП') {
				axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')
				shipment.push(d.count || 0)
			}
		})

		outputData?.data.forEach(d => {
			if (d.product == 'СНП') {
				if (d.forStock) stoke.push(d.count || 0)
				else output.push(d.count || 0)
			}
		})

		setAxis(Array.from(axisLine))
		setShipment({ name: 'Отгружено, шт', data: shipment })
		setOutput({ name: 'Выпуск в заказы, шт', data: output })
		setStoke({ name: 'Выпуск на склад, шт', data: stoke })
	}, [shipmentData, outputData])

	if (isFetchShipment || isFetchOutput) return <Fallback />
	return (
		<>
			<Line data={{ series: [shipment, output, stoke], axis }} />
		</>
	)
}
