import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useRefresh } from '@/hooks/refresh'

import Main from '@/layout/Main/Main'
import RequireAuth from './pages/Auth/RequireAuth'
import { Fallback } from './components/Fallback/Fallback'

const Auth = lazy(() => import('@/pages/Auth/Auth'))

const Home = lazy(() => import('@/pages/Home/Home/Home'))

const Criterions = lazy(() => import('@/pages/CriterionsGroup/Criterions/Criterions'))
const Injuries = lazy(() => import('@/pages/CriterionsGroup/Injuries/Injuries'))
const Defects = lazy(() => import('@/pages/CriterionsGroup/Defects/Defects'))
const DefectsTime = lazy(() => import('@/pages/CriterionsGroup/DefectsTime/DefectsTime'))
const AwaitingDecision = lazy(() => import('@/pages/CriterionsGroup/AwaitingDecision/AwaitingDecision'))
const NumberInBrigade = lazy(() => import('@/pages/CriterionsGroup/NumberInBrigade/NumberInBrigade'))
const OutputVolume = lazy(() => import('@/pages/CriterionsGroup/OutputVolume/OutputVolume'))
const OrdersVolume = lazy(() => import('@/pages/CriterionsGroup/OrdersVolume/OrdersVolume'))
const Shipment = lazy(() => import('@/pages/CriterionsGroup/Shipment/Shipment'))
const ProductionLoad = lazy(() => import('@/pages/CriterionsGroup/ProductionLoad/ProductionLoad'))
const ProductionPlan = lazy(() => import('@/pages/CriterionsGroup/ProductionPlan/ProductionPlan'))
const ShippingPlan = lazy(() => import('@/pages/CriterionsGroup/ShippingPlan/ShippingPlan'))
const OutputPlan = lazy(() => import('@/pages/CriterionsGroup/ProductionPlan/OutputPlan'))
const SemiFinished = lazy(() => import('@/pages/CriterionsGroup/SemiFinished/SemiFinished'))
const Tooling = lazy(() => import('@/pages/CriterionsGroup/Tooling/Tooling'))
const Safety = lazy(() => import('@/pages/CriterionsGroup/Safety/Safety'))
const Quality = lazy(() => import('@/pages/CriterionsGroup/Quality/Quality'))

const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <Fallback />

	return (
		<BrowserRouter basename={'/'}>
			<Suspense fallback={<Fallback />}>
				<Routes>
					<Route path='/auth' element={<Auth />} />

					<Route
						path='/'
						element={
							<RequireAuth>
								<Main />
							</RequireAuth>
						}
					>
						<Route index element={<Home />} />
						<Route path='criterions' element={<Criterions />}>
							<Route path='injuries' element={<Injuries />} />
							<Route path='defects' element={<Defects />} />
							<Route path='defect-time' element={<DefectsTime />} />
							<Route path='awaiting-decision' element={<AwaitingDecision />} />
							<Route path='number-in-brigade' element={<NumberInBrigade />} />

							<Route path='output-volume' element={<OutputVolume />} />
							<Route path='orders-volume' element={<OrdersVolume />} />
							<Route path='shipment' element={<Shipment />} />
							<Route path='production-load' element={<ProductionLoad />} />
							<Route path='production-plan' element={<ProductionPlan />} />
							<Route path='shipping-plan' element={<ShippingPlan />} />
							<Route path='output-plan' element={<OutputPlan />} />
							<Route path='semi-finished' element={<SemiFinished />} />
							<Route path='tooling' element={<Tooling />} />
							<Route path='safety' element={<Safety />} />
							<Route path='quality' element={<Quality />} />
						</Route>
					</Route>

					<Route path='*' element={<NotFound />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
