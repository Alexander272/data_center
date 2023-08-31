import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ICriterion } from '@/types/criterion'

export interface ICriterionState {
	active: string
	criterions: ICriterion[]
	skipped: string[]
	date: string
}

const initialState: ICriterionState = {
	active: '',
	criterions: [],
	skipped: [],
	date: '',
}

export const cardSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setCriterions: (state, action: PayloadAction<ICriterion[]>) => {
			state.criterions = action.payload
			//TODO надо смотреть есть ли выполненные критерии
			state.skipped = action.payload.map(c => c.key)
			state.active = state.skipped[0]
		},

		setDate: (state, action: PayloadAction<string>) => {
			state.date = action.payload
		},

		setActive: (state, action: PayloadAction<string>) => {
			state.active = action.payload
		},

		setComplete: (state, action: PayloadAction<string>) => {
			state.skipped = state.skipped.filter(s => s != action.payload)

			state.criterions = state.criterions.map(c => {
				if (c.id == action.payload) c.complete = true
				return c
			})
		},
	},
})

export const { setCriterions, setDate, setActive, setComplete } = cardSlice.actions

export default cardSlice.reducer
