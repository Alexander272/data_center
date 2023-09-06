export interface ICriterion {
	id: string
	key: string
	label: string
	type: string
	complete?: boolean
}

export interface ICompleteCriterion {
	id: string
	type: string
	date: string
}

export interface ICompleteReport {
	date: string
	complete: boolean
}

export interface IReportFilter {
	type: 'day'
	date: string
}
