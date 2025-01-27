import { IPeriod } from './period'

export interface IQuality {
	id: string
	date: number
	// type: 'final' | 'fixable'
	product: string
	title: string
	count: number
	number: number
	time: number
	// 	amount: number
	// 	percent: number
	// 	cost: number
}

export interface IQualityDTO {
	id?: string
	date?: number
	// type?: 'final' | 'fixable'
	product?: string
	title: string | null
	count: number | null
	number: number | null
	time: number | null
	// amount: number | null
	// percent: number | null
	// cost: number | null
}

export interface IGetQuality {
	product: string
	period: IPeriod
}
