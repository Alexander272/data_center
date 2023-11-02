export interface IShippingPlan {
	id: string | null
	day?: string
	numberOfOrders: number | null
	sumMoney: number | null
	quantity: number | null
}

export interface IShippingPlanDTO {
	id: string
	day: string
	numberOfOrders: number
	sumMoney: string
	quantity: number
}
