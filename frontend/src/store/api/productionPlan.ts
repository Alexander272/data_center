import type { IProductionPlan, IProductionPlanDTO, PlanType } from '@/types/productionPlan'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const planApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о плане за период
		getProductionPlanByPeriod: builder.query<{ data: IProductionPlan[] }, { period: IPeriod; type: PlanType }>({
			query: ({ period, type }) => ({
				url: `criterions/production-plan/${period.from}${period.to ? '-' + period.to : ''}`,
				method: 'GET',
				params: new URLSearchParams([['type', type]]),
			}),
			// TODO возможно стоит добавить тип к id
			providesTags: [{ type: 'Api', id: `production-plan` }],
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
	planApi
