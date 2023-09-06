import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { Container } from './header.style'
import { CheckPermission } from '@/utils/auth'

export const Header = () => {
	return (
		<Container>
			<Box mr={'auto'}></Box>
			<Link to={'/'}>Главная</Link>
			{CheckPermission({ section: 'criterions', method: 'GET' }) && <Link to={'criterions'}>Критерии</Link>}
		</Container>
	)
}
