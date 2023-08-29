import { configureStore } from '@reduxjs/toolkit'
import { api, unauthenticatedMiddleware } from './api/base'
import userReducer from './user'
import criterionsReducer from './criterions'

export const store = configureStore({
	reducer: {
		user: userReducer,
		criterions: criterionsReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware).concat(unauthenticatedMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
