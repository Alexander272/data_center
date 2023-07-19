import { Link } from 'react-router-dom'
import { Container } from './home.style'

export default function Home() {
	return (
		<Container>
			<Link to={'criterions'}>Критерии</Link>
		</Container>
	)
}
