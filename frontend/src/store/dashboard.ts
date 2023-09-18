import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import type { IPeriod, PeriodEnum } from '@/types/period'

export interface IDashboardState {
	periodType: PeriodEnum
	period: IPeriod
	hasNextPeriod: boolean
}

const initialState: IDashboardState = {
	periodType: 'day',
	// period: { from: FormatDate(new Date(Date.now() - 86400000)) },
	period: { from: dayjs().subtract(1, 'd').format('DD.MM.YYYY') },
	hasNextPeriod: false,
}

export const dashboardSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setPeriodType: (state, action: PayloadAction<PeriodEnum>) => {
			state.periodType = action.payload

			const date = dayjs().subtract(1, 'd')

			if (action.payload == 'day') {
				// state.period.from = FormatDate(new Date(Date.now() - 86400000))
				state.period.from = date.format('DD.MM.YYYY')
				state.period.to = ''
			}
			if (action.payload == 'week') {
				// const week = GetWeek()
				// state.period.from = week.monday
				// state.period.to = week.sunday
				if (date.day() > 3) {
					state.period.from = date.startOf('w').format('DD.MM.YYYY')
					state.period.to = date.endOf('w').format('DD.MM.YYYY')
				} else {
					const d = date.subtract(5, 'd')
					state.period.from = d.startOf('w').format('DD.MM.YYYY')
					state.period.to = d.endOf('w').format('DD.MM.YYYY')
				}
			}
			if (action.payload == 'month') {
				state.period.from = date.startOf('M').format('DD.MM.YYYY')
				state.period.to = date.endOf('M').format('DD.MM.YYYY')
			}
		},
		prevPeriod: state => {
			// const parts = state.period.from.split('.')
			// const from = new Date(+parts[2], +parts[1] - 1, +parts[0])

			// parts = state.period.to?.split('.') || ['0', '0', '0']
			// const to = new Date(+parts[2], +parts[1] - 1, +parts[0])

			const date = dayjs(state.period.from, 'DD.MM.YYYY')

			if (state.periodType == 'day') {
				// from.setDate(+parts[0] - 1)
				// state.period.from = FormatDate(from)
				state.period.from = date.subtract(1, 'd').format('DD.MM.YYYY')
			}
			if (state.periodType == 'week') {
				const d = date.subtract(7, 'd')
				state.period.from = d.startOf('w').format('DD.MM.YYYY')
				state.period.to = d.endOf('w').format('DD.MM.YYYY')
				// from.setDate(+parts[0] - 1)
				// const week = GetWeek(from)
				// state.period.from = week.monday
				// state.period.to = week.sunday
			}
			if (state.periodType == 'month') {
				const d = date.subtract(1, 'M')
				state.period.from = d.startOf('M').format('DD.MM.YYYY')
				state.period.to = d.endOf('M').format('DD.MM.YYYY')
			}

			// parts = state.period.from.split('.')
			// const newFrom = new Date(+parts[2], +parts[1] - 1, +parts[0])

			// if (from.getTime() >= newFrom.getTime()) state.hasNextPeriod = true
			// else state.hasNextPeriod = false

			// console.log(from.getTime() >= newFrom.getTime())
		},
		nextPeriod: state => {
			// const parts = state.period.from.split('.')
			// const from = new Date(+parts[2], +parts[1] - 1, +parts[0])

			const date = dayjs(state.period.from, 'DD.MM.YYYY')

			if (state.periodType == 'day') {
				// from.setDate(+parts[0] + 1)
				// state.period.from = FormatDate(from)
				state.period.from = date.add(1, 'd').format('DD.MM.YYYY')
			}
			if (state.periodType == 'week') {
				const d = date.add(7, 'd')
				state.period.from = d.startOf('w').format('DD.MM.YYYY')
				state.period.to = d.endOf('w').format('DD.MM.YYYY')
			}
			if (state.periodType == 'month') {
				const d = date.add(1, 'M')
				state.period.from = d.startOf('M').format('DD.MM.YYYY')
				state.period.to = d.endOf('M').format('DD.MM.YYYY')
			}

			// parts = state.period.to?.split('.') || ['0', '0', '0']
			// const to = new Date(+parts[2], +parts[1] - 1, +parts[0])

			// if (state.periodType == 'week') {
			// 	to.setDate(+parts[0] - 1)
			// 	const week = GetWeek(from)
			// 	state.period.from = week.monday
			// 	state.period.to = week.sunday
			// }

			// parts = state.period.from.split('.')
			// const newFrom = new Date(+parts[2], +parts[1] - 1, +parts[0])

			// if (from.getTime() >= newFrom.getTime()) state.hasNextPeriod = true
			// else state.hasNextPeriod = false
		},
		setPeriod: (state, action: PayloadAction<string | IPeriod>) => {
			if (typeof action.payload == 'string') state.period.from = action.payload
			else state.period = action.payload
		},
	},
})

export const { setPeriodType, prevPeriod, nextPeriod, setPeriod } = dashboardSlice.actions

export default dashboardSlice.reducer
