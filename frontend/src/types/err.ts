export interface IError {
	message: string
}

export interface IResError {
	data: IError
}

export interface IFetchError {
	data: {
		message: string
		code: string
	}
}

export interface IBaseFetchError {
	error: {
		data: {
			message: string
			code: string
		}
	}
	status: number
}
