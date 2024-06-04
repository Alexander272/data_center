export interface ITooling {
	id: string | null
	day?: string
	request: number | null
	done: number | null
	progress: number | null
}

export interface IToolingDTO {
	id: string
	day: number
	request: number
	done: number
	progress?: number
}
