export interface IProductionLoad {
	id: string | null
	date?: string
	sector: string | null
	days: number | null
	quantity: number | null
	money: number | null
}

export interface IProductionLoadDTO {
	id: string
	date: number
	sector: string
	days: number
	quantity: number
	money: number
}
