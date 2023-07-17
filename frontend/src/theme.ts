import { createTheme } from '@mui/material/styles'
import { red, grey } from '@mui/material/colors'

declare module '@mui/material/styles' {
	interface Palette {
		neutral: Palette['primary']
	}

	interface PaletteOptions {
		neutral: PaletteOptions['primary']
	}

	interface PaletteColor {
		darker?: string
	}

	interface SimplePaletteColorOptions {
		darker?: string
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		neutral: true
	}
}

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			main: '#062e93',
		},
		secondary: {
			main: '#556cd6',
		},
		neutral: {
			main: grey.A400,
		},
		error: {
			main: red.A400,
		},
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: '1rem',
					backgroundColor: '#000000de',
				},
				arrow: {
					color: '#000000de',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
})

export default theme
