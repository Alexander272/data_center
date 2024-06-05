export interface IShipment {
	id: string | null
	date?: string
	product: string | null
	count: number | null
	money: number | null
}

export interface IShipmentDTO {
	id: string
	date: number
	product: string
	count: string
	money: string
}

export interface IShipmentFull {
	id: string
	date: string
	product: string
	count: number
	money: number
	planQuantity: number
	planMoney: number
}
