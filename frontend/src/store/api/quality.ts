import { IGetQuality, IQuality, IQualityDTO } from '@/types/quality'
import { API } from '@/constants/api'
import { api } from './base'

export const QualityApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getQualityByPeriod: builder.query<{ data: IQuality[] }, IGetQuality>({
			query: req => ({
				url: API.Criterions.Quality,
				params: new URLSearchParams({
					product: req.product,
					'period[from]': req.period.from,
					'period[to]': req.period.to || '',
				}),
			}),
			providesTags: (_res, _err, arg) => [{ type: 'Quality', id: `${arg.period.from}-${arg.period.to || ''}` }],
		}),

		// createQuality: builder.mutation<null, IQualityDTO>({
		// 	query: data => ({
		// 		url: API.Criterions.Quality,
		// 		method: 'POST',
		// 		body: data,
		// 	}),
		// 	invalidatesTags: (_res, _err, arg) => [{ type: 'Quality', id: `${arg.date}-` }],
		// }),
		createQuality: builder.mutation<null, IQualityDTO[]>({
			query: data => ({
				url: `${API.Criterions.Quality}/several`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Quality', id: `${arg[0].date || ''}-` }],
		}),

		updateQuality: builder.mutation<null, IQualityDTO[]>({
			query: data => ({
				url: `${API.Criterions.Quality}/several`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_res, _err, arg) => [{ type: 'Quality', id: `${arg[0].date || ''}-` }],
		}),
	}),
})

export const { useGetQualityByPeriodQuery, useCreateQualityMutation, useUpdateQualityMutation } = QualityApi
