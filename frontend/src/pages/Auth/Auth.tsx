import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useStore'
import { Container, Wrapper, Base } from './auth.style'
import { SignIn } from './components/AuthForms/SignInForm'
// import { SignUp } from './components/AuthForms/SignUpForm'
// import Header from './components/Header/Header'

export default function Auth() {
	const navigate = useNavigate()
	const location = useLocation()

	const isAuth = useAppSelector(state => state.user.isAuth)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	const from: string = location.state?.from?.pathname || '/'

	useEffect(() => {
		if (isAuth) {
			navigate(from, { replace: true })
		}
	}, [isAuth, navigate, from])

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
