import type { IPeriod } from '@/types/period'
import type { ISafety, ISafetyDTO } from '@/types/safety'
import { API } from '@/constants/api'
import { api } from './base'

export const SafetyApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getSafetyByPeriod: builder.query<{ data: ISafety[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.Safety,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'Safety', id: `${arg.from}-${arg.to || ''}` }],
		}),

		createSafety: builder.mutation<null, ISafetyDTO>({
			query: data => ({
				url: API.Criterions.Safety,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Safety', id: `${arg.date}-` }],
		}),

		updateSafety: builder.mutation<null, ISafetyDTO>({
			query: data => ({
				url: `${API.Criterions.Safety}/${data?.id || ''}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Safety', id: `${arg.date}-` }],
		}),
	}),
})

export const { useGetSafetyByPeriodQuery, useCreateSafetyMutation, useUpdateSafetyMutation } = SafetyApi
