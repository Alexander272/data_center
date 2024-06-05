import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Fallback } from '@/components/Fallback/Fallback'
import { Header } from '@/components/Header/Header'
import { Base, Wrapper } from './main.style'

export default function Main() {
	return (
		<Base>
			<Suspense fallback={<Fallback />}>
				<Header />

				<Wrapper>
					<Suspense fallback={<Fallback height={'auto'} />}>
						<Outlet />
					</Suspense>
				</Wrapper>
			</Suspense>
		</Base>
	)
}
