export type PeriodEnum = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'period'

export interface IPeriod {
	from: string
	to?: string
}
