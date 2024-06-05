export interface IOutputVolume {
	id: string | null
	date?: string
	forStock?: boolean
	product: string | null
	count: number | null
	money: number | null
}

export interface IOutputVolumeDTO {
	id: string
	forStock: boolean
	date: number
	product: string
	count: string
	money: string
}

export interface IOutput {
	id: string
	date: string
	forStock: boolean
	product: string
	count: number
	money: number
	planQuantity: number
	planMoney: number
}
