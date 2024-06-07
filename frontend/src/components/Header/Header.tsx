import { Box, Stack } from '@mui/material'

import { PermRules } from '@/constants/permissions'
import { AppRoutes } from '@/constants/routes'
import { useSignOutMutation } from '@/store/api/auth'
import { useCheckPermission } from '@/utils/check'
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
					<NavLink to={AppRoutes.HOME}>Главная</NavLink>

					{useCheckPermission(PermRules.Criterions.Write) && (
						<NavLink to={AppRoutes.CRITERIONS}>Критерии</NavLink>
					)}

					<NavButton onClick={signOutHandler}>Выйти</NavButton>
				</Stack>
			</Box>
		</Container>
	)
}
