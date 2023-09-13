import type { IProductionPlan, IProductionPlanDTO } from '@/types/productionPlan'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const loadApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о плане за период
		getProductionPlanByPeriod: builder.query<{ data: IProductionPlan[] }, IPeriod>({
			query: period => `criterions/production-plan/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: `production-load` }],
		}),

		// сохранение данных о плане
		saveProductionPlan: builder.mutation<string, IProductionPlanDTO[]>({
			query: data => ({
				url: 'criterions/production-plan/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `production-plan` }],
		}),

		// обновление данных о плане
		updateProductionPlan: builder.mutation<string, IProductionPlanDTO[]>({
			query: data => ({
				url: 'criterions/production-plan/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `production-plan` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetProductionPlanByPeriodQuery, useSaveProductionPlanMutation, useUpdateProductionPlanMutation } =
	loadApi
