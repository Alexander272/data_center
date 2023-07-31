import { Suspense } from 'react'
import { Container } from './home.style'
import { CircularProgress } from '@mui/material'
import Secure from './components/Secure'

export default function Home() {
	return (
		<Container>
			<Suspense fallback={<CircularProgress />}>
				<Secure />
			</Suspense>
		</Container>
	)
}
