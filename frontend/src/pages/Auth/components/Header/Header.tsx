import { FC } from 'react'
import { Container, LogoLink } from './header.style'

// type Props = {}

const Header: FC = () => {
	return (
		<Container>
			<LogoLink to='/'>
				{/* <Logo width={192} height={192} loading='lazy' src='/logo192.webp' alt='logo' /> */}
				{/* <Logo width={340} height={100} loading='lazy' src='/logo.webp' alt='logo' /> */}
				{/* <Logo width={391} height={100} loading='lazy' src='/logo_2.webp' alt='logo' /> */}
				{/* <span>Силур</span> */}
			</LogoLink>
		</Container>
	)
}

export default Header
