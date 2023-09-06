import type { ICompleteCriterion, ICriterion } from '@/types/criterion'
import { api } from './base'

export const criterionsApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение списка доступных критериев
		getCriterions: builder.query<{ data: ICriterion[] }, string>({
			query: day => `criterions/${day}`,
			// providesTags: (_res, _err, day) => [{ type: 'Api', id: `criterions/${day}` }],
		}),

		// отметка о заполнении критерия
		completeCriterion: builder.mutation<string, ICompleteCriterion>({
			query: data => ({
				url: `criterions/complete/${data.id}`,
				method: 'POST',
				body: data,
			}),
			// invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `criterions/${data.date}` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetCriterionsQuery, useCompleteCriterionMutation } = criterionsApi
