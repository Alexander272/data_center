import type { IShipment, IShipmentDTO } from '@/types/shipment'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const shipmentApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных об отгрузках за день
		getShipmentByPeriod: builder.query<{ data: IShipment[] }, IPeriod>({
			query: period => `criterions/shipment/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: `shipment-` }],
		}),

		// сохранение данных об отгрузках
		saveShipment: builder.mutation<string, IShipmentDTO[]>({
			query: data => ({
				url: 'criterions/shipment/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `shipment-` }],
		}),

		// обновление данных об отгрузках
		updateShipment: builder.mutation<string, IShipmentDTO[]>({
			query: data => ({
				url: 'criterions/shipment/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `shipment-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetShipmentByPeriodQuery, useSaveShipmentMutation, useUpdateShipmentMutation } = shipmentApi
