import { Box, Stack } from '@mui/material'
import { CheckPermission } from '@/utils/auth'
import { Container, NavLink } from './header.style'

export const Header = () => {
	return (
		<Container>
			<Box maxWidth={1580} width={'100%'} padding={'0px 10px'} display={'flex'}>
				<Box mr={'auto'}></Box>
				<Stack direction={'row'} spacing={3} height={'100%'}>
					<NavLink to='/'>Главная</NavLink>

					{CheckPermission({ section: 'criterions', method: 'GET' }) && (
						<NavLink to={'criterions'}>Критерии</NavLink>
					)}
				</Stack>
			</Box>
		</Container>
	)
}
