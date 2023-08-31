export interface IShipmentPlan {
	id: string | null
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
