import { configureStore } from '@reduxjs/toolkit'
import { api } from './api/base'
import userReducer from './user'
import criterionsReducer from './criterions'
import dashboardReducer from './dashboard'

export const store = configureStore({
	reducer: {
		user: userReducer,
		criterions: criterionsReducer,
		dashboard: dashboardReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
