import type { IOrdersVolume, IOrdersVolumeDTO } from '@/types/orderVolume'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const ordersApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о заказах переданных в производство
		getOrdersVolumeByPeriod: builder.query<{ data: IOrdersVolume[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.OrdersVolume,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'OrdersVolume', id: `${arg.from}-${arg.to || ''}` }],
		}),

		// сохранение данных о заказах переданных в производство
		saveOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: API.Criterions.OrdersVolume,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'OrdersVolume', id: `${arg.date}-` }],
		}),

		// обновление данных о заказах переданных в производство
		updateOrdersVolume: builder.mutation<string, IOrdersVolumeDTO>({
			query: data => ({
				url: `${API.Criterions.OrdersVolume}/${data.date}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'OrdersVolume', id: `${arg.date}-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOrdersVolumeByPeriodQuery, useSaveOrdersVolumeMutation, useUpdateOrdersVolumeMutation } = ordersApi
