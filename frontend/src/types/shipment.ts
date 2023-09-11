export interface IShipmentPlan {
	id: string | null
	day?: string
	product: string | null
	count: number | null
	money: number | null
}

export interface IShipmentPlanDTO {
	id: string
	day: string
	product: string
	count: string
	money: string
}

export interface IShipment {
	id: string
	date: string
	product: string
	count: number
	money: number
	planMoney: number
}
