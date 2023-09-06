import type { IShipmentPlan, IShipmentPlanDTO } from '@/types/shipment'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const shipmentApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных об отгрузках за день
		getShipmentPlanByPeriod: builder.query<{ data: IShipmentPlan[] }, IPeriod>({
			query: period => `criterions/shipment-plan/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: (_res, _err, period) => [
				{ type: 'Api', id: `shipment-plan/${period.from}${period.to ? '-' + period.to : ''}` },
			],
		}),

		// сохранение данных об отгрузках
		saveShipmentPlan: builder.mutation<string, IShipmentPlanDTO[]>({
			query: data => ({
				url: 'criterions/shipment-plan/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `shipment-plan/${data[0].day}` }],
		}),

		// обновление данных об отгрузках
		updateShipmentPlan: builder.mutation<string, IShipmentPlanDTO[]>({
			query: data => ({
				url: 'criterions/shipment-plan/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `shipment-plan/${data[0].day}` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetShipmentPlanByPeriodQuery, useSaveShipmentPlanMutation, useUpdateShipmentPlanMutation } =
	shipmentApi
