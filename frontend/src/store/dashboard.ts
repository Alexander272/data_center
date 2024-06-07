import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import type { IPeriod, PeriodEnum } from '@/types/period'

export interface IDashboardState {
	periodType: PeriodEnum
	period: IPeriod
	hasNextPeriod: boolean
}

const initialState: IDashboardState = {
	periodType: 'day',
	period: { from: dayjs().startOf('d').subtract(1, 'd').unix().toString() },
	hasNextPeriod: false,
}

export const dashboardSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setPeriodType: (state, action: PayloadAction<PeriodEnum>) => {
			state.periodType = action.payload

			const date = dayjs().startOf('d').subtract(1, 'd')

			if (action.payload == 'day') {
				state.period.from = date.unix().toString()
				state.period.to = ''
			}
			if (action.payload == 'week') {
				let d = date
				if (date.day() < 3) d = date.subtract(5, 'd')

				state.period.from = d.startOf('w').unix().toString()
				state.period.to = d.endOf('w').unix().toString()
			}
			if (action.payload == 'month') {
				let d = date
				if (date.date() < 8) d = date.subtract(10, 'd')

				state.period.from = d.startOf('M').unix().toString()
				state.period.to = d.endOf('M').unix().toString()
			}
			// if (action.payload == 'quarter') {
			// 	let d = date
			// 	// if (date.date() < 8) d = date.subtract(10, 'd')

			// 	state.period.from = d.startOf('Q').unix().toString()
			// 	state.period.to = d.endOf('Q').unix().toString()
			// }
		},
		prevPeriod: state => {
			const date = dayjs(+state.period.from * 1000)

			if (state.periodType == 'day') {
				state.period.from = date.subtract(1, 'd').unix().toString()
			}
			if (state.periodType == 'week') {
				const d = date.subtract(7, 'd')
				state.period.from = d.startOf('w').unix().toString()
				state.period.to = d.endOf('w').unix().toString()
			}
			if (state.periodType == 'month') {
				const d = date.subtract(1, 'M')
				state.period.from = d.startOf('M').unix().toString()
				state.period.to = d.endOf('M').unix().toString()
			}
		},
		nextPeriod: state => {
			const date = dayjs(+state.period.from * 1000)

			if (state.periodType == 'day') {
				state.period.from = date.add(1, 'd').unix().toString()
			}
			if (state.periodType == 'week') {
				const d = date.add(7, 'd')
				state.period.from = d.startOf('w').unix().toString()
				state.period.to = d.endOf('w').unix().toString()
			}
			if (state.periodType == 'month') {
				const d = date.add(1, 'M')
				state.period.from = d.startOf('M').unix().toString()
				state.period.to = d.endOf('M').unix().toString()
			}
		},
		setPeriod: (state, action: PayloadAction<string | IPeriod>) => {
			if (typeof action.payload == 'string') state.period.from = action.payload
			else state.period = action.payload
		},
	},
})

export const { setPeriodType, prevPeriod, nextPeriod, setPeriod } = dashboardSlice.actions

export default dashboardSlice.reducer
