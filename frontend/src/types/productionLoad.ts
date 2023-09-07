export interface IProductionLoad {
	id: string | null
	sector: string | null
	days: number | null
}

export interface IProductionLoadDTO {
	id: string
	date: string
	sector: string
	days: number
}
