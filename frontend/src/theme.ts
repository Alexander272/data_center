import { createTheme } from '@mui/material/styles'
import { red, grey } from '@mui/material/colors'

// import { type IScrollbarParameters, generateScrollbarStyles } from '@/utils/generateScrollbarStyles'

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

// const scrollbarParameters: IScrollbarParameters = {
// 	borderRadius: '5px',
// 	scrollbarBgColor: 'rgba(186, 193, 205, 0.2)',
// 	scrollbarHeight: '1rem',
// 	scrollbarWidth: '.5rem',
// 	thumbColor: '#00000020',
// 	thumbColorActive: '#00000050',
// 	thumbColorHover: '#00000030',
// }

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
		// MuiCssBaseline: {
		// 	styleOverrides: generateScrollbarStyles(scrollbarParameters),
		// },
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
