import type { IOrdersVolume, IOrdersVolumeDTO } from '@/types/orderVolume'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const ordersApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о заказах переданных в производство
		getOrdersVolumeByPeriod: builder.query<{ data: IOrdersVolume[] }, IPeriod>({
			query: period => `criterions/orders-volume/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: `orders-volume` }],
		}),

		// сохранение данных о заказах переданных в производство
		saveOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: 'criterions/orders-volume/',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `orders-volume` }],
		}),

		// обновление данных о заказах переданных в производство
		updateOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: `criterions/orders-volume/${data.day}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `orders-volume` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOrdersVolumeByPeriodQuery, useSaveOrdersVolumeMutation, useUpdateOrdersVolumeMutation } = ordersApi
