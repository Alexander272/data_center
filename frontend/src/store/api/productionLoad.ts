import type { IProductionLoad, IProductionLoadDTO } from '@/types/productionLoad'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const loadApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о загрузке за период
		getProductionLoadByPeriod: builder.query<{ data: IProductionLoad[] }, IPeriod>({
			query: period => `criterions/production-load/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: `production-load` }],
		}),

		// сохранение данных о загрузке
		saveProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: 'criterions/production-load/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `production-load` }],
		}),

		// обновление данных о загрузке
		updateProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: 'criterions/production-load/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `production-load` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetProductionLoadByPeriodQuery, useSaveProductionLoadMutation, useUpdateProductionLoadMutation } =
	loadApi
