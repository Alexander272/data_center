import { IPeriod } from './period'

export interface IQuality {
	id: string
	date: number
	type: 'final' | 'fixable'
	product: string
	number: number
	title: string
	amount: number
	percent: number
	cost: number
}

export interface IQualityDTO {
	id?: string
	date?: number
	type?: 'final' | 'fixable'
	product?: string
	number: number | null
	title: string | null
	amount: number | null
	percent: number | null
	cost: number | null
}

export interface IGetQuality {
	product: string
	period: IPeriod
}
