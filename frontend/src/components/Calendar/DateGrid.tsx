import { FC, useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import { Week } from './Week'

type Props = {
	date: Dayjs
	selected: string | string[]
	picker?: 'day' | 'week' | 'month' | 'year'
}

export const DateGrid: FC<Props> = ({ date, selected, picker }) => {
	const [weeks, setWeeks] = useState<Dayjs[]>([])

	useEffect(() => {
		const newWeeks = []

		let d = date.startOf('M')
		if (d.day() == 1) {
			newWeeks.push(d.subtract(7, 'd'))
		} else {
			d = d.startOf('w')
		}

		while (newWeeks.length < 6) {
			newWeeks.push(d)
			d = d.add(7, 'd')
		}

		setWeeks(newWeeks)
	}, [date])

	return weeks.map(w => (
		<Week key={w.format('DD.MM')} startWeek={w} selected={selected} currentMonth={date.month()} picker={picker} />
	))
}
