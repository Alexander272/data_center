import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { useGetShipmentByPeriodQuery } from '@/store/api/shipment'
import { useGetProductionPlanByPeriodQuery } from '@/store/api/productionPlan'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'
import { Line } from '@/pages/Home/components/LineChart/Line'
import { Fallback } from '@/components/Fallback/Fallback'

export const Costs = () => {
	const [axis, setAxis] = useState<string[]>([])
	const [shipment, setShipment] = useState<ISeriesData>({ name: 'Отгружено', data: [] })
	const [output, setOutput] = useState<ISeriesData>({ name: 'Выпуск в заказы', data: [] })

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
	const { data: annualPlan, isFetching: isFetchAnnualPlan } = useGetProductionPlanByPeriodQuery(
		{ period: { from, to }, type: 'annual' },
		{ skip: !from }
	)

	const { data: outputData, isFetching: isFetchOutput } = useGetOutputVolumeByPeriodQuery(
		{ from, to },
		{ skip: !from }
	)
	const { data: outputPlan, isFetching: isFetchOutputPlan } = useGetProductionPlanByPeriodQuery(
		{ period: { from, to }, type: 'output' },
		{ skip: !from }
	)

	useEffect(() => {
		const axisLine = new Set<string>()
		const shipment: number[] = []
		const output: number[] = []

		shipmentData?.data.forEach(d => {
			if (d.product == 'СНП') {
				axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')
				shipment.push(d.money || 0)
			}
		})

		outputData?.data.forEach(d => {
			if (d.product == 'СНП') {
				if (!d.forStock) output.push(d.money || 0)
			}
		})

		setAxis(Array.from(axisLine))
		setShipment({ name: 'Отгружено, руб', data: shipment, mark: annualPlan?.data[0].money || 0 })
		setOutput({ name: 'Выпуск в заказы, руб', data: output, mark: outputPlan?.data[0].money || 0 })
	}, [shipmentData, annualPlan, outputData, outputPlan])

	if (isFetchShipment || isFetchAnnualPlan || isFetchOutput || isFetchOutputPlan) return <Fallback />
	return (
		<>
			<Line data={{ series: [shipment, output], axis }} />
		</>
	)
}
