import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ICriterion } from '@/types/criterion'

export interface ICriterionState {
	active: string
	criterions: ICriterion[]
	skipped: string[]
}

const initialState: ICriterionState = {
	active: '',
	criterions: [],
	skipped: [],
}

export const cardSlice = createSlice({
	name: 'criterions',
	initialState,
	reducers: {
		setCriterions: (state, action: PayloadAction<ICriterion[]>) => {
			state.criterions = action.payload
			//TODO надо смотреть есть ли выполненные критерии
			state.skipped = action.payload.map(c => c.id)
			state.active = state.skipped[0]
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

export const { setCriterions, setActive, setComplete } = cardSlice.actions

export default cardSlice.reducer
