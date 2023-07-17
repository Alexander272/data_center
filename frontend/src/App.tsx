import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { AppRoutes } from '@/routes'
import { store } from '@/store/store'
import theme from '@/theme'

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppRoutes />
			</ThemeProvider>
		</Provider>
	)
}

export default App
