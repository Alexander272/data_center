import {
	type BaseQueryFn,
	type FetchArgs,
	type FetchBaseQueryError,
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import type { IUser } from '@/types/user'
import { API } from '@/constants/api'
import { resetUser, setUser } from '../user'
import { RootState } from '../store'

export const baseUrl = '/api/v1/'

const baseQuery = fetchBaseQuery({
	baseUrl: baseUrl,
	mode: 'cors',
	credentials: 'include',
	prepareHeaders: (headers, api) => {
		const token = (api.getState() as RootState).user.token
		if (token) headers.set('authorization', `Bearer ${token}`)

		return headers
	},
})

const mutex = new Mutex()

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	// mutex позволяет предотвратить множественное обращение на обновление токена
	await mutex.waitForUnlock()
	let result = await baseQuery(args, api, extraOptions)

	if (result.error && result.error.status === 401 && api.endpoint !== 'signIn' && api.endpoint != 'refresh') {
		if (!mutex.isLocked()) {
			const release = await mutex.acquire()

			try {
				const refreshResult = await baseQuery({ url: API.Auth.Refresh, method: 'POST' }, api, extraOptions)
				if (refreshResult.data) {
					api.dispatch(setUser((refreshResult.data as { data: IUser }).data))
					result = await baseQuery(args, api, extraOptions)
				} else {
					// if (refreshResult.error?.status === 401) {
					// 	enqueueSnackbar(Messages.AUTHORIZATION_TIMEOUT, { variant: 'error' })
					// } else if (refreshResult.error?.status === 'FETCH_ERROR') {
					// 	enqueueSnackbar(Messages.ERROR_CONNECTION, { variant: 'error' })
					// }
					api.dispatch(resetUser())
				}
			} finally {
				release()
			}
		} else {
			await mutex.waitForUnlock()
			result = await baseQuery(args, api, extraOptions)
		}
	}
	return result
}

export const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	tagTypes: [
		'Api',
		'Criterion',
		'Complete',
		'OrdersVolume',
		'OutputVolume',
		'ProductionLoad',
		'ProductionPlan',
		'Shipment',
		'ShippingPlan',
		'SemiFinished',
		'Tooling',
	],
	endpoints: () => ({}),
})

// export const {} = api

// проверка статуса ответа. если он 401, то пользователь не авторизован и его надо выкинуть на страницу авторизации
// export const unauthenticatedMiddleware: Middleware =
// 	({ dispatch }: MiddlewareAPI) =>
// 	next =>
// 	action => {
// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// 		if (isRejectedWithValue(action) && action.payload.status === 401) {
// 			dispatch(clearUser())
// 		}
// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
// 		return next(action)
// 	}
