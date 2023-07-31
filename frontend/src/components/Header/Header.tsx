import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { Container } from './header.style'

export const Header = () => {
	return (
		<Container>
			<Box mr={'auto'}></Box>
			<Link to={'criterions'}>Критерии</Link>
		</Container>
	)
}
