export type PeriodEnum = 'day' | 'week' | 'month' | 'year' | 'period'

export interface IPeriod {
	from: string
	to?: string
}
