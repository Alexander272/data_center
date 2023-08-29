export interface ICell {
	value: string
}

export interface IDefect {
	order: string | null
	name: string | null
	defect: string | null
	count: number | null
	executor: string | null
	// place: string | null
}

export interface IInjuries {
	name: string | null
	injury: string | null
	brigade: string | null
}

export interface INumberInBrigade {
	number: number | null
	brigade: string | null
}

export interface IOutputVolume {
	product: string | null
	count: number | null
	money: number | null
}

export interface IOrdersVolume {
	id: string | null
	numberOfOrders: number | null
	sumMoney: number | null
	quantity: number | null
}

export interface IDefectTime {
	order: string | null
	name: string | null
	defect: string | null
	executor: string | null
	time: number | null
	// place: string | null
}

export interface IAwaitingDecision {
	order: string | null
	name: string | null
	defect: string | null
	decision: string | null
}

export interface IShipmentPlan {
	id: string | null
	product: string | null
	count: number | null
	money: number | null
}
