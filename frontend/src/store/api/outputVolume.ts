import type { IOutputVolume, IOutputVolumeDTO } from '@/types/outputVolume'
import type { IPeriod } from '@/types/period'
import { api } from './base'

export const outputApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о выпуске за период
		getOutputVolumeByPeriod: builder.query<{ data: IOutputVolume[] }, IPeriod>({
			query: period => `criterions/output-volume/${period.from}${period.to ? '-' + period.to : ''}`,
			providesTags: [{ type: 'Api', id: `output-volume` }],
		}),

		// сохранение данных о выпуске
		saveOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: 'criterions/output-volume/several',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `output-volume` }],
		}),

		// обновление данных о выпуске
		updateOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: 'criterions/output-volume/several',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: `output-volume` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOutputVolumeByPeriodQuery, useSaveOutputVolumeMutation, useUpdateOutputVolumeMutation } = outputApi
