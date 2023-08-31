import { useAppSelector } from '@/hooks/useStore'
import { Navigate, useLocation } from 'react-router-dom'

// проверка авторизации пользователя
export default function RequireAuth({ children }: { children: JSX.Element }) {
	const isAuth = useAppSelector(state => state.user.isAuth)
	// const role = useAppSelector(state => state.user.roleCode)
	// const roles = state.roles
	const location = useLocation()

	if (!isAuth) return <Navigate to='/auth' state={{ from: location }} />

	return children
}
