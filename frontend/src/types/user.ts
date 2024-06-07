export interface ISignIn {
	username: string
	password: string
}

export interface IUser {
	id: string
	name: string
	role: string
	menu: string[]
	token: string
}
