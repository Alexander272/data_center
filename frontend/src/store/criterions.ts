import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ICriterion } from '@/types/criterion'

export interface ICriterionState {
	active: string
	complete: boolean
	criterions: ICriterion[]
	skipped: string[]
	date: string
}

const initialState: ICriterionState = {
	active: '',
	complete: false,
	criterions: [],
	skipped: [],
	date: '',
}

export const criterionSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setCriterions: (state, action: PayloadAction<ICriterion[]>) => {
			state.complete = false
			state.criterions = action.payload
			// state.skipped = action.payload.map(c => {
			// if (c.complete) return ''
			// return c.key
			// })
			// state.skipped = state.skipped.filter(c => Boolean(c))
			if (state.active == '') {
				//TODO перестать использовать skipped
				state.skipped = action.payload.map(c => c.key)
				state.active = state.skipped[0] || ''
			}
		},

		setDate: (state, action: PayloadAction<string>) => {
			state.date = action.payload
			state.complete = false
			state.active = ''
		},

		setActive: (state, action: PayloadAction<string>) => {
			state.active = action.payload
			state.complete = false
			// state.complete = state.criterions.find(c => c.key == action.payload)?.complete || false
		},

		setComplete: state => {
			// setComplete: (state, action: PayloadAction<string>) => {
			// state.skipped = state.skipped.filter(s => s != action.payload)
			state.complete = true

			// state.criterions = state.criterions.map(c => {
			// 	if (c.key == action.payload) c.complete = true
			// 	return c
			// })
		},
	},
})

export const { setCriterions, setDate, setActive, setComplete } = criterionSlice.actions

export default criterionSlice.reducer
