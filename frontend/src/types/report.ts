import { PeriodEnum } from './period'

export interface IDay {
	id: string
	complete?: boolean
	day: string
}

export interface IReport {
	id: string
	completed: []
}

export interface IReportFilter {
	type: PeriodEnum
	date: number
}

// export type Criterion = {

// }
