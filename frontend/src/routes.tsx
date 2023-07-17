import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
// import { useRefresh } from '@/hooks/refresh'

import Main from '@/layout/Main/Main'

// const Home = lazy(() => import('@/pages/Home/Home'))
// const Masks = lazy(() => import('@/pages/Masks/Masks'))

// const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

export const AppRoutes = () => {
	// const { ready } = useRefresh()

	// if (!ready) return <></>

	return (
		<BrowserRouter basename={'/'}>
			<Suspense fallback={<CircularProgress />}>
				<Routes>
					<Route
						path='/'
						element={
							// <RequireAuth>
							<Main />
							// </RequireAuth>
						}
					>
						{/* <Route index element={<Home />} />
						<Route path='masks' element={<Masks />} /> */}
					</Route>

					{/* <Route path='*' element={<NotFound />} /> */}
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
