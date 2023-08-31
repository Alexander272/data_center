import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './useStore'
import { setAuth } from '@/store/user'
import { refresh } from '@/services/auth'

export function useRefresh() {
	const [loading, setLoading] = useState(false)
	const [ready, setReady] = useState(false)
	const userId = useAppSelector(state => state.user.userId)

	const dispatch = useAppDispatch()

	const refreshUser = useCallback(async () => {
		setLoading(true)
		const res = await refresh()
		if (!res.error && res.data) dispatch(setAuth(res.data.data))
		setReady(true)
		setLoading(false)
	}, [dispatch])

	useEffect(() => {
		// if (loading) return
		if (!ready && !userId && !loading) void refreshUser()
	}, [loading, ready, refreshUser, userId])

	return { ready }
}
