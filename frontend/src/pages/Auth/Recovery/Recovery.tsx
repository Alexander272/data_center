import { FormEvent, SyntheticEvent, useState } from 'react'
import { Alert, Button, FormControl, Snackbar, Typography } from '@mui/material'
import { useInput } from '@/hooks/useInput'
import { ValidMessage } from '../components/ValidMessage/ValidMessage'
import { Input, Title } from '../components/AuthForms/forms.style'
import { Form } from './recovery.style'
import { Container, Wrapper, Base } from '../auth.style'
import { recovery } from '@/services/user'
import { Loader } from '@/components/Loader/Loader'

type Alert = { open: boolean; type: 'success' | 'error'; message: string }

// страница для запроса на восстановление пароля
export default function Recovery() {
	const [alert, setAlert] = useState<Alert>({
		open: false,
		type: 'success',
		message: '',
	})
	const [loading, setLoading] = useState(false)
	const email = useInput({ validation: 'email' })

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let emailValid = email.validate()
		if (!emailValid) return

		setLoading(true)
		const res = await recovery(email.value)
		if (res.error) {
			console.log(res.error)
			handleClick('error', res.error)
		} else {
			handleClick('success', 'Для продолжения перейдите по ссылке, отправленной вам в письме')
		}
		setLoading(false)
	}

	const handleClick = (type: 'success' | 'error', message: string) => {
		setAlert({ open: true, type, message })
	}
	const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ open: false, type: 'success', message: '' })
	}

	return (
		<Base>
			<Wrapper>
				<Container>
					<Form onSubmit={submitHandler}>
						<Snackbar
							open={alert.open}
							autoHideDuration={6000}
							onClose={handleClose}
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						>
							<Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
								{alert.message}
							</Alert>
						</Snackbar>

						{loading ? <Loader background='fill' /> : null}

						<Title open={true}>Восстановление пароля</Title>

						<Typography align='justify' marginTop={2}>
							Укажите адрес электронной почты привязанный к аккаунту, и мы отправим на него инструкции по
							восстановлению пароля.
						</Typography>
						<FormControl sx={{ marginTop: 3, marginBottom: 2, position: 'relative' }}>
							<Input
								label='email'
								type='email'
								value={email.value}
								onChange={email.onChange}
								error={!email.valid}
								size='small'
							/>
							{!email.valid && <ValidMessage messages={['Email не корректен']} />}
						</FormControl>

						<Button
							type='submit'
							variant='contained'
							sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 4 }}
						>
							Восстановить
						</Button>
					</Form>
				</Container>
			</Wrapper>
		</Base>
	)
}
