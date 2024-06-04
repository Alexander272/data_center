export interface ISemiFinished {
	id: string | null
	day?: string
	product: string | null
	count: number | null
}

export interface ISemiFinishedDTO {
	id: string
	day: number
	product: string
	count: number
}
