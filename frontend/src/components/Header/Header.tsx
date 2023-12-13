import { Box, Stack } from '@mui/material'
import { CheckPermission } from '@/utils/auth'
import { useSignOutMutation } from '@/store/api/auth'
import { Container, NavButton, NavLink } from './header.style'

export const Header = () => {
	const [signOut] = useSignOutMutation()

	const signOutHandler = () => {
		void signOut(undefined)
	}

	return (
		<Container>
			<Box maxWidth={1580} width={'100%'} padding={'0px 10px'} display={'flex'}>
				<Box mr={'auto'}>{/* LOGO */}</Box>
				<Stack direction={'row'} spacing={3} height={'100%'}>
					<NavLink to='/'>Главная</NavLink>

					{CheckPermission({ section: 'criterions', method: 'WRITE' }) && (
						<NavLink to={'criterions'}>Критерии</NavLink>
					)}

					<NavButton onClick={signOutHandler}>Выйти</NavButton>
				</Stack>
			</Box>
		</Container>
	)
}
