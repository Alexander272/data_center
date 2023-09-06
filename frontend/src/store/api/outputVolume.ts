import type { IOutputVolume, IOutputVolumeDTO } from '@/types/outputVolume'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const outputApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных об отгрузках за день
		getOutputVolumeByPeriod: builder.query<{ data: IOutputVolume[] }, IPeriod>({
			query: period => `criterions/output-volume/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: (_res, _err, period) => [
				{ type: 'Api', id: `output-volume/${period.from}${period.to ? '-' + period.to : ''}` },
			],
		}),

		// сохранение данных об отгрузках
		saveOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: 'criterions/output-volume/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `output-volume/${data[0].day}` }],
		}),

		// обновление данных об отгрузках
		updateOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: 'criterions/output-volume/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, data) => [{ type: 'Api', id: `output-volume/${data[0].day}` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOutputVolumeByPeriodQuery, useSaveOutputVolumeMutation, useUpdateOutputVolumeMutation } = outputApi
