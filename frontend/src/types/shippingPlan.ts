export interface IShippingPlan {
	id: string | null
	date?: string
	numberOfOrders: number | null
	sumMoney: number | null
	quantity: number | null
}

export interface IShippingPlanDTO {
	id: string
	date: number
	numberOfOrders: number
	sumMoney: string
	quantity: number
}
