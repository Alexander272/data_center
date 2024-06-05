import type { IProductionPlan, IProductionPlanDTO, PlanType } from '@/types/productionPlan'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const planApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о плане за период
		getProductionPlanByPeriod: builder.query<{ data: IProductionPlan[] }, { period: IPeriod; type: PlanType }>({
			query: ({ period, type }) => ({
				url: API.Criterions.ProductionPlan,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '', type: type }),
			}),
			providesTags: (_res, _err, arg) => [
				{ type: 'ProductionPlan', id: `${arg.period.from}-${arg.period.to || ''}` },
			],
		}),

		// сохранение данных о плане
		saveProductionPlan: builder.mutation<string, IProductionPlanDTO[]>({
			query: data => ({
				url: `${API.Criterions.ProductionPlan}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ProductionPlan', id: `${arg[0].date}-` }],
		}),

		// обновление данных о плане
		updateProductionPlan: builder.mutation<string, IProductionPlanDTO[]>({
			query: data => ({
				url: `${API.Criterions.ProductionPlan}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ProductionPlan', id: `${arg[0].date}-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetProductionPlanByPeriodQuery, useSaveProductionPlanMutation, useUpdateProductionPlanMutation } =
	planApi
