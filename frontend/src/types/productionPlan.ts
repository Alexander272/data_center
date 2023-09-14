export interface IProductionPlan {
	id: string | null
	product: string | null
	quantity: number | null
	money: number | null
}

export type PlanType = 'annual' | 'shipment' | 'output'

export interface IProductionPlanDTO {
	id: string
	type: PlanType
	date: string
	product: string
	quantity?: number
	money: string
}

export interface IPlan {
	id: string
	date: string
	product: string
	count: number
	money: number
	planQuantity?: number
	planMoney: number
}
