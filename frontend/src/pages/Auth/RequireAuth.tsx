import { Navigate, useLocation } from 'react-router-dom'

import { AppRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useStore'
import { getMenu, getToken } from '@/store/user'
import { Forbidden } from '../Forbidden/ForbiddenLazy'

// проверка авторизации пользователя
export default function RequireAuth({ children }: { children: JSX.Element }) {
	const token = useAppSelector(getToken)
	const menu = useAppSelector(getMenu)
	const location = useLocation()

	if (!token) return <Navigate to={AppRoutes.AUTH} state={{ from: location }} />
	if (!menu || !menu.length) return <Forbidden />

	return children
}
