import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

export const PageBox = styled(Box)<BoxProps>(() => ({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	margin: '10px auto 40px',
	padding: '0 12px',
})) as typeof Box
