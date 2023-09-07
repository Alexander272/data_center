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
	date: string
}

// export type Criterion = {

// }
