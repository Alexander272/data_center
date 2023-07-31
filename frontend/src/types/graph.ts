export interface ISecure {
	day: number
	group: {
		number: string
		status: 'bad' | 'good'
	}[]
}
