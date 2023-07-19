// import { useCallback, useEffect, useState } from 'react'
// import { useAppDispatch, useAppSelector } from './useStore'
// import { setAuth } from '@/store/user'
// import { refresh } from '@/services/auth'

// export function useRefresh() {
// 	const [loading, setLoading] = useState(false)
// 	const [ready, setReady] = useState(false)
// 	const userId = useAppSelector(state => state.user.userId)

// 	const dispatch = useAppDispatch()

// 	const refreshUser = useCallback(async () => {
// 		setLoading(true)
// 		const res = await refresh()
// 		if (!res.error) dispatch(setAuth({ id: res.data.data.id, roleCode: res.data.data.roleCode }))
// 		setReady(true)
// 		setLoading(false)
// 	}, [ready, userId])

// 	useEffect(() => {
// 		// if (loading) return
// 		if (!ready && !userId && !loading) refreshUser()
// 	}, [refreshUser])

// 	return { ready }
// }
