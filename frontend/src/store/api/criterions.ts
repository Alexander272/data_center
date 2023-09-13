import type { ICompleteCriterion, ICompleteReport, ICriterion } from '@/types/criterion'
import type { IReportFilter } from '@/types/report'
import { api } from './base'

export const criterionsApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение списка доступных критериев
		getCriterions: builder.query<{ data: ICriterion[] }, string>({
			query: day => `criterions/${day}`,
			providesTags: (_res, _err, day) => [{ type: 'Api', id: `criterions/${day}` }],
		}),

		// получение списка выполненных дней (месяцев)
		getCompletedPeriod: builder.query<{ data: ICompleteReport[] }, IReportFilter>({
			query: data => ({
				url: `criterions/complete`,
				method: 'GET',
				params: new URLSearchParams([
					['type', data.type],
					['date', data.date],
				]),
			}),
			providesTags: [{ type: 'Api', id: 'criterions/complete' }],
		}),

		// отметка о заполнении критерия
		completeCriterion: builder.mutation<string, ICompleteCriterion>({
			query: data => ({
				url: `criterions/complete/${data.id}`,
				method: 'POST',
				body: data,
			}),
			// invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `criterions/${data.date}` }],
			invalidatesTags: (_res, _err, data) => [
				{ type: 'Api', id: `criterions/${data.date}` },
				{ type: 'Api', id: 'criterions/complete' },
			],
		}),
	}),
	overrideExisting: false,
})

export const { useGetCriterionsQuery, useGetCompletedPeriodQuery, useCompleteCriterionMutation } = criterionsApi
