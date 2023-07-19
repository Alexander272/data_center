import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { Header } from '@/components/Header/Header'
// import { Loader } from '@/components/Loader/Loader'
import { Base, Wrapper } from './main.style'

// import { Header } from '@/components/Header/Header'
// const Footer = lazy(() => import('@/components/Footer/Footer'))
// const Card = lazy(() => import('@/pages/Card/Card'))

export default function Main() {
	return (
		<Base>
			<Suspense fallback={<CircularProgress />}>
				<Header />

				<Wrapper>
					<Suspense fallback={<CircularProgress />}>
						<Outlet />
					</Suspense>
				</Wrapper>
			</Suspense>
		</Base>
	)
}
