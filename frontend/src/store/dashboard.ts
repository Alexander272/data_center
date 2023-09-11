import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPeriod, PeriodEnum } from '@/types/period'
import { FormatDate, GetWeek } from '@/utils/date'

export interface IDashboardState {
	periodType: PeriodEnum
	period: IPeriod
}

const initialState: IDashboardState = {
	periodType: 'day',
	period: { from: FormatDate(new Date(Date.now() - 86400000)) },
}

export const dashboardSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setPeriodType: (state, action: PayloadAction<PeriodEnum>) => {
			state.periodType = action.payload

			if (action.payload == 'day') {
				state.period.from = FormatDate(new Date(Date.now() - 86400000))
				state.period.to = ''
			}
			if (action.payload == 'week') {
				const week = GetWeek()
				state.period.from = week.monday
				state.period.to = week.sunday
			}
		},
		setPeriod: (state, action: PayloadAction<string | IPeriod>) => {
			if (typeof action.payload == 'string') state.period.from = action.payload
			else state.period = action.payload
		},
	},
})

export const { setPeriodType, setPeriod } = dashboardSlice.actions

export default dashboardSlice.reducer
