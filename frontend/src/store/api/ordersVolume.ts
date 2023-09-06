import type { IOrdersVolume, IOrdersVolumeDTO } from '@/types/orderVolume'
import { api } from './base'

export const ordersApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о заказах переданных в производство
		getOrdersVolumeByDay: builder.query<{ data: IOrdersVolume[] }, string>({
			query: day => `criterions/orders-volume/${day}`,
			providesTags: (_res, _err, day) => [{ type: 'Api', id: `orders-volume/${day}` }],
		}),

		// сохранение данных о заказах переданных в производство
		saveOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: 'criterions/orders-volume/',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `orders-volume/${data.day}` }],
		}),

		// обновление данных о заказах переданных в производство
		updateOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: `criterions/orders-volume/${data.day}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `orders-volume/${data.day}` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOrdersVolumeByDayQuery, useSaveOrdersVolumeMutation, useUpdateOrdersVolumeMutation } = ordersApi
