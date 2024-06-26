export interface ICriterion {
	id: string
	key: string
	label: string
	type: string
	complete?: boolean
}

export interface ICompleteCriterion {
	// id:string
	// type: string
	// date: string
	criterionId: string
	date: number
}

export interface ICompleteReport {
	date: number
	complete: boolean
}
