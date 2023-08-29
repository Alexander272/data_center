import { FC } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Container, Icon, Password } from './password.style'

type Props = {
	password: string
}

export const VisiblePassword: FC<Props> = ({ password }) => {
	return (
		<Container>
			<Icon>
				<RemoveRedEyeIcon />
			</Icon>
			<Password>{password}</Password>
		</Container>
	)
}
