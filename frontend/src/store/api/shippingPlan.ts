import type { IShippingPlan, IShippingPlanDTO } from '@/types/shippingPlan'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const shippingPlanApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение данных о плане отгрузок
		getShippingPlanByPeriod: builder.query<{ data: IShippingPlan[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.ShippingPlan,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'ShippingPlan', id: `${arg.from}-${arg.to || ''}` }],
		}),

		// сохранение данных о плане отгрузок
		createShippingPlan: builder.mutation<void, IShippingPlanDTO>({
			query: data => ({
				url: API.Criterions.ShippingPlan,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ShippingPlan', id: `${arg.date}-` }],
		}),

		// обновление данных о плане отгрузок
		updateShippingPlan: builder.mutation<void, IShippingPlanDTO>({
			query: data => ({
				url: `${API.Criterions.ShippingPlan}/${data.date}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'ShippingPlan', id: `${arg.date}-` }],
		}),
	}),
})

export const { useGetShippingPlanByPeriodQuery, useCreateShippingPlanMutation, useUpdateShippingPlanMutation } =
	shippingPlanApi
