export const FormatDate = (date: Date) => {
	return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const GetWeek = () => {
	const date = new Date()

	const day = date.getDate()
	const dayInWeek = date.getDay()
	let t = 7
	if (dayInWeek > 3) t = 0

	const monday = new Date(date.setDate(day - dayInWeek - t + 1))
	const sunday = new Date(date.setDate(date.getDate() + 6))

	return { monday: FormatDate(monday), sunday: FormatDate(sunday) }
}
