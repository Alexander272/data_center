import type { IShipmentPlan, IShipmentPlanDTO } from '@/types/sheet'
import { api } from './base'

export const shipmentApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных об отгрузках за день
		getShipmentPlanByDay: builder.query<{ data: IShipmentPlan[] }, string>({
			query: day => `criterions/shipment-plan/${day}`,
			providesTags: (_res, _err, day) => [{ type: 'Api', id: `shipment-plan/${day}` }],
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
	}),
	overrideExisting: false,
})

export const { useGetShipmentPlanByDayQuery, useSaveShipmentPlanMutation } = shipmentApi
