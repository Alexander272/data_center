import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Alert, Button, FormControl, LinearProgress, Snackbar } from '@mui/material'
import { Input, FormContent, SignInForm, Title } from './forms.style'
import { VisiblePassword } from '../VisiblePassword/VisiblePassword'
import { ISignIn } from '@/types/user'
import { signIn } from '@/services/auth'
import { useAppDispatch } from '@/hooks/useStore'
import { setUser } from '@/store/user'

type Props = {
	isOpen: boolean
}

// форма авторизации
export const SignIn: FC<Props> = ({ isOpen }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string>('')

	const dispatch = useAppDispatch()

	const usernameHandler = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)

	const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

	const submitHandler = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!username || !password) return

		void signInHandler()
	}

	const signInHandler = async () => {
		setLoading(true)
		const value: ISignIn = { username, password }

		const res = await signIn(value)
		if (res.error) {
			handleClick(res.error)
		} else if (res.data) {
			dispatch(setUser(res.data))
		}
		setLoading(false)
	}

	const handleClick = (message: string) => {
		setOpen(true)
		setError(message)
	}

	const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<SignInForm open={isOpen} onSubmit={submitHandler}>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
					{error}
				</Alert>
			</Snackbar>

			{loading ? <LinearProgress sx={{ position: 'absolute', bottom: 1, left: 0, right: 0 }} /> : null}

			<Title open={isOpen}>Вход</Title>

			<FormContent>
				<FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
					<Input
						value={username}
						onChange={usernameHandler}
						name='username or email'
						placeholder='Имя пользователя или Email'
						size='small'
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						value={password}
						onChange={passwordHandler}
						name='password'
						type='password'
						placeholder='Пароль'
						size='small'
						// error={!password.valid}
					/>
					<VisiblePassword password={password} />
				</FormControl>

				{/* <NavLink to='recovery'>Забыли пароль?</NavLink> */}

				<Button
					type='submit'
					variant='contained'
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 3 }}
					disabled={loading}
				>
					Войти
				</Button>
			</FormContent>
		</SignInForm>
	)
}
