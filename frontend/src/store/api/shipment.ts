import type { IShipment, IShipmentDTO } from '@/types/shipment'
import type { IPeriod } from '@/types/period'
import { api } from './base'
import { API } from '@/constants/api'

export const shipmentApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных об отгрузках за день
		getShipmentByPeriod: builder.query<{ data: IShipment[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.Shipment,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'Shipment', id: `${arg.from}-${arg.to || ''}` }],
		}),

		// сохранение данных об отгрузках
		saveShipment: builder.mutation<string, IShipmentDTO[]>({
			query: data => ({
				url: `${API.Criterions.Shipment}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Shipment', id: `${arg[0].date}-` }],
		}),

		// обновление данных об отгрузках
		updateShipment: builder.mutation<string, IShipmentDTO[]>({
			query: data => ({
				url: `${API.Criterions.Shipment}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Shipment', id: `${arg[0].date}-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetShipmentByPeriodQuery, useSaveShipmentMutation, useUpdateShipmentMutation } = shipmentApi
