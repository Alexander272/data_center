import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AppRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useStore'
import { getToken } from '@/store/user'
import { SignIn } from './components/AuthForms/SignInForm'
import { Container, Wrapper, Base } from './auth.style'

type LocationState = {
	from?: Location
}

export default function Auth() {
	const navigate = useNavigate()
	const location = useLocation()

	const token = useAppSelector(getToken)

	useEffect(() => {
		let to = (location.state as LocationState)?.from?.pathname || AppRoutes.HOME
		if (to == AppRoutes.AUTH) to = AppRoutes.HOME
		if (token) navigate(to, { replace: true })
	}, [token, navigate, location.state])

	return (
		<Base>
			{/* <Header /> */}
			<Wrapper>
				<Container signUp={false}>
					<SignIn isOpen={true} />
				</Container>
			</Wrapper>
		</Base>
	)
}
