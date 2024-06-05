export interface ISemiFinished {
	id: string | null
	date?: string
	product: string | null
	count: number | null
}

export interface ISemiFinishedDTO {
	id: string
	date: number
	product: string
	count: number
}
