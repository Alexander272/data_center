import type { ISignIn, IUser } from '@/types/user'

const url = '/api/v1/auth/'

type Options = {
	method: string
	headers: {
		[key: string]: string
	}
	body?: string
}

const options: Options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

export const signIn = async (value: ISignIn) => {
	options.body = JSON.stringify(value)
	try {
		const response = await fetch(url + 'sign-in', options)
		const data = (await response.json()) as { data: IUser; message: string }

		if (response.ok) return { data: data.data, error: null }
		else return { data: null, error: data.message }
	} catch (error: unknown) {
		return { data: null, error: error as string }
	}
}

export const signOut = async () => {
	try {
		const response = await fetch(url + 'sign-out', options)
		const data = (await response.json()) as { message: string }

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: unknown) {
		return { error: error as string }
	}
}

// обновление токена доступа
export const refresh = async () => {
	// options.body = JSON.stringify(value)
	try {
		const response = await fetch(url + 'refresh', options)
		const data = (await response.json()) as { data: IUser; message: string }

		if (response.ok) return { data: data, error: null }
		else return { data: null, error: data.message }
	} catch (error: unknown) {
		return { data: null, error: error as string }
	}
}
