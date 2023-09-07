import type { IProductionLoad, IProductionLoadDTO } from '@/types/productionLoad'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const loadApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о загрузке за период
		getProductionLoadByPeriod: builder.query<{ data: IProductionLoad[] }, IPeriod>({
			query: period => `criterions/production-load/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: (_res, _err, period) => [
				{ type: 'Api', id: `production-load/${period.from}${period.to ? '-' + period.to : ''}` },
			],
		}),

		// сохранение данных о загрузке
		saveProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: 'criterions/production-load/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `production-load/${data[0].date}` }],
		}),

		// обновление данных о загрузке
		updateProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: 'criterions/production-load/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `production-load/${data[0].date}` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetProductionLoadByPeriodQuery, useSaveProductionLoadMutation, useUpdateProductionLoadMutation } =
	loadApi
