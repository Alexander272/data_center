import type { IProductionLoad, IProductionLoadDTO } from '@/types/productionLoad'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const loadApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о загрузке за период
		getProductionLoadByPeriod: builder.query<{ data: IProductionLoad[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.ProductionLoad,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'ProductionLoad', id: `${arg.from}-${arg.to || ''}` }],
		}),

		// сохранение данных о загрузке
		saveProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: `${API.Criterions.ProductionLoad}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ProductionLoad', id: `${arg[0].date}-` }],
		}),

		// обновление данных о загрузке
		updateProductionLoad: builder.mutation<string, IProductionLoadDTO[]>({
			query: data => ({
				url: `${API.Criterions.ProductionLoad}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ProductionLoad', id: `${arg[0].date}-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetProductionLoadByPeriodQuery, useSaveProductionLoadMutation, useUpdateProductionLoadMutation } =
	loadApi
