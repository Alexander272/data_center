export interface ISignIn {
	username: string
	password: string
}

export interface IUser {
	id: string
	userName: string
	sector: string
	role: string
	menu: IMenu[]
}

export interface IMenu {
	id: string
	name: string
	type: string
}
