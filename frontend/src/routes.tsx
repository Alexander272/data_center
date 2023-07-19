import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
// import { useRefresh } from '@/hooks/refresh'

import Main from '@/layout/Main/Main'

const Home = lazy(() => import('@/pages/Home/Home'))

const Criterions = lazy(() => import('@/pages/Criterions/Criterions'))
const Injuries = lazy(() => import('@/pages/Injuries/Injuries'))
const Defects = lazy(() => import('@/pages/Defects/Defects'))

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
						<Route index element={<Home />} />
						<Route path='criterions' element={<Criterions />}>
							<Route path='injuries' element={<Injuries />} />
							<Route path='defects' element={<Defects />} />
						</Route>
					</Route>

					{/* <Route path='*' element={<NotFound />} /> */}
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
