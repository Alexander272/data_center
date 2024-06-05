export interface ITooling {
	id: string | null
	date?: string
	request: number | null
	done: number | null
	progress: number | null
}

export interface IToolingDTO {
	id: string
	date: number
	request: number
	done: number
	progress?: number
}
