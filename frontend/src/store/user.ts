import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IUser } from '@/types/user'

export interface IUserState {
	ready: boolean
	loading: boolean
	token: string
	userId: string
	isAuth: boolean
	role: string
	user?: IUser
}

const initialState: IUserState = {
	ready: false,
	loading: false,
	token: '',
	userId: '',
	isAuth: false,
	role: 'user',
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// установка авторизации пользователя
		setAuth: (state, action: PayloadAction<IUser>) => {
			state.token = action.payload.token
			state.userId = action.payload.id
			state.role = action.payload.role
			state.isAuth = true
			state.user = action.payload
		},
		// установка данных о пользователе и авторизации
		setUser: (state, action: PayloadAction<IUser>) => {
			state.token = action.payload.token
			state.userId = action.payload.id
			state.role = action.payload.role
			state.isAuth = true
			state.user = action.payload
		},
		// сброс пользователя
		clearUser: () => initialState,
	},
})

export const { setAuth, setUser, clearUser } = userSlice.actions

export default userSlice.reducer
