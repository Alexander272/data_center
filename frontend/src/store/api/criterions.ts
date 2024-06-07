import type { ICompleteCriterion, ICompleteReport, ICriterion } from '@/types/criterion'
import type { IReportFilter } from '@/types/report'
import { API } from '@/constants/api'
import { api } from './base'

export const criterionsApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение списка доступных критериев
		getCriterions: builder.query<{ data: ICriterion[] }, string>({
			query: day => `${API.Criterions.Base}/${day}`,
			providesTags: (_res, _err, arg) => [{ type: 'Criterion', id: arg }],
		}),

		// получение списка выполненных дней (месяцев)
		getCompletedPeriod: builder.query<{ data: ICompleteReport[] }, IReportFilter>({
			query: data => ({
				url: `${API.Criterions.Complete}/${data.date}`,
				method: 'GET',
				// params: new URLSearchParams({ date: data.date.toString() }),
			}),
			providesTags: [{ type: 'Complete', id: `week` }],
		}),

		// отметка о заполнении критерия
		completeCriterion: builder.mutation<string, ICompleteCriterion>({
			query: data => ({
				url: API.Criterions.Complete,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [
				{ type: 'Criterion', id: `${arg.date}` },
				{ type: 'Complete', id: `week` },
			],
		}),
	}),
	overrideExisting: false,
})

export const { useGetCriterionsQuery, useGetCompletedPeriodQuery, useCompleteCriterionMutation } = criterionsApi
