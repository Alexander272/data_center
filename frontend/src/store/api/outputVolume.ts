import type { IOutputVolume, IOutputVolumeDTO } from '@/types/outputVolume'
import type { IPeriod } from '@/types/period'
import { API } from '@/constants/api'
import { api } from './base'

export const outputApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение данных о выпуске за период
		getOutputVolumeByPeriod: builder.query<{ data: IOutputVolume[] }, IPeriod>({
			query: period => ({
				url: API.Criterions.OutputVolume,
				params: new URLSearchParams({ 'period[from]': period.from, 'period[to]': period.to || '' }),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'OutputVolume', id: `${arg.from}-${arg.to || ''}` }],
		}),

		// сохранение данных о выпуске
		saveOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: `${API.Criterions.OutputVolume}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'OutputVolume', id: `${arg[0].date}-` }],
		}),

		// обновление данных о выпуске
		updateOutputVolume: builder.mutation<string, IOutputVolumeDTO[]>({
			query: data => ({
				url: `${API.Criterions.OutputVolume}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'OutputVolume', id: `${arg[0].date}-` }],
		}),
	}),
	overrideExisting: false,
})

export const { useGetOutputVolumeByPeriodQuery, useSaveOutputVolumeMutation, useUpdateOutputVolumeMutation } = outputApi
