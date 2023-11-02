import { IShippingPlan, IShippingPlanDTO } from '@/types/shippingPlan'
import { api } from './base'
import { IPeriod } from '@/types/period'

export const shippingPlanApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение данных о плане отгрузок
		getShippingPlanByPeriod: builder.query<{ data: IShippingPlan[] }, IPeriod>({
			query: period => `criterions/shipping-plan/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: 'shipping-plan' }],
		}),

		// сохранение данных о плане отгрузок
		createShippingPlan: builder.mutation<void, IShippingPlanDTO>({
			query: data => ({
				url: `criterions/shipping-plan/`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: 'shipping-plan' }],
		}),

		// обновление данных о плане отгрузок
		updateShippingPlan: builder.mutation<void, IShippingPlanDTO>({
			query: data => ({
				url: `criterions/shipping-plan/${data.day}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: 'shipping-plan' }],
		}),
	}),
})

export const { useGetShippingPlanByPeriodQuery, useCreateShippingPlanMutation, useUpdateShippingPlanMutation } =
	shippingPlanApi
