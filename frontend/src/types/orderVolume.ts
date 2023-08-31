export interface IOrdersVolume {
	id: string | null
	numberOfOrders: number | null
	sumMoney: number | null
	quantity: number | null
}

export interface IOrdersVolumeDTO {
	id: string
	day: string
	numberOfOrders: number
	sumMoney: string
	quantity: number
}
