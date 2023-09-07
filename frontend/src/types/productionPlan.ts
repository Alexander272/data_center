export interface IProductionPlan {
	id: string | null
	product: string | null
	money: number | null
}

export interface IProductionPlanDTO {
	id: string
	date: string
	product: string
	money: string
}
