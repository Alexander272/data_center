import type { ICriterion } from '@/types/criterion'
import { api } from './base'

export const criterionsApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение списка доступных критериев
		getCriterions: builder.query<{ data: ICriterion[] }, string>({
			query: day => `criterions/${day}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetCriterionsQuery } = criterionsApi
