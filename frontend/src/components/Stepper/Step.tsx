import { FC } from 'react'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckOutlined'
import EastIcon from '@mui/icons-material/EastOutlined'
import { Icon, StepContainer } from './stepper.style'

type Props = {
	id: string
	label: string
	active?: boolean
	complete?: boolean
	// onSelect: (id: string) => void
}

export const Step: FC<Props> = ({ id, label, active, complete }) => {
	return (
		<StepContainer active={active} complete={complete} data-id={id}>
			<Typography sx={{ pointerEvents: 'none' }}>{label}</Typography>

			{complete && (
				<Icon>
					<CheckIcon />
				</Icon>
			)}
			{!complete && active ? (
				<Icon>
					<EastIcon />
				</Icon>
			) : null}
		</StepContainer>
	)
}
