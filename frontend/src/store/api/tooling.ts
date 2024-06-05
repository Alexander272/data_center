import type { IPeriod } from '@/types/period'
import type { ITooling, IToolingDTO } from '@/types/tooling'
import { API } from '@/constants/api'
import { api } from './base'

export const ToolingApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getToolingByPeriod: builder.query<{ data: ITooling[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.Tooling,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'Tooling', id: `${arg.from}-${arg.to || ''}` }],
		}),

		createTooling: builder.mutation<null, IToolingDTO>({
			query: data => ({
				url: API.Criterions.Tooling,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Tooling', id: `${arg.date}-` }],
		}),

		updateTooling: builder.mutation<null, IToolingDTO>({
			query: data => ({
				url: `${API.Criterions.Tooling}/${data.id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Tooling', id: `${arg.date}-` }],
		}),
	}),
})

export const { useGetToolingByPeriodQuery, useCreateToolingMutation, useUpdateToolingMutation } = ToolingApi
