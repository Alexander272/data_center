import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import '@fontsource/roboto/400.css'

import { AppRoutes } from '@/routes'
import { store } from '@/store/store'
import theme from '@/theme'

dayjs.extend(customParseFormat)
dayjs.locale('ru') // глобальная локализация дат

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
