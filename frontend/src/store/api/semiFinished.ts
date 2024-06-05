import type { ISemiFinished, ISemiFinishedDTO } from '@/types/semiFinished'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const semiFinishedApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getSemiFinishedByPeriod: builder.query<{ data: ISemiFinished[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.SemiFinished,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'SemiFinished', id: `${arg.from}-${arg.to || ''}` }],
		}),

		createSemiFinished: builder.mutation<null, ISemiFinishedDTO[]>({
			query: data => ({
				url: `${API.Criterions.SemiFinished}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'SemiFinished', id: `${arg[0].date}-` }],
		}),

		updateSemiFinished: builder.mutation<null, ISemiFinishedDTO[]>({
			query: data => ({
				url: `${API.Criterions.SemiFinished}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'SemiFinished', id: `${arg[0].date}-` }],
		}),
	}),
})

export const { useGetSemiFinishedByPeriodQuery, useCreateSemiFinishedMutation, useUpdateSemiFinishedMutation } =
	semiFinishedApi
