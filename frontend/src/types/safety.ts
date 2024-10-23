export interface ISafety {
	id: string
	date: number
	violations: number
	injuries: number
}

export interface ISafetyDTO {
	id?: string
	date: number
	violations: number | null
	injuries: number | null
}
