import type { ISignIn, IUser } from '@/types/user'
import { API } from '@/constants/api'
import { resetUser } from '../user'
import { api } from './base'

export const authApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		signIn: builder.mutation<{ data: IUser }, ISignIn>({
			query: data => ({
				url: API.Auth.SignIn,
				method: 'POST',
				body: data,
			}),
		}),

		signOut: builder.mutation<string, undefined>({
			query: () => ({
				url: API.Auth.SignOut,
				method: 'POST',
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					console.error(error)
				} finally {
					api.dispatch(resetUser())
				}
			},
		}),

		refresh: builder.query<{ data: IUser }, undefined>({
			query: () => ({
				url: API.Auth.Refresh,
				method: 'POST',
			}),
		}),
	}),
})

export const { useSignInMutation, useSignOutMutation, useRefreshQuery } = authApi
