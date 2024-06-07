import { useEffect, useState } from 'react'
import { useAppDispatch } from './useStore'
import { setUser } from '@/store/user'
import { useRefreshQuery } from '@/store/api/auth'

export function useRefresh() {
	const [ready, setReady] = useState(false)

	const { data, isError, isSuccess } = useRefreshQuery(undefined)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isSuccess) {
			dispatch(setUser(data.data))
			setReady(true)
		}
	}, [data, isSuccess, dispatch])

	useEffect(() => {
		if (isError) setReady(true)
	}, [isError])

	return { ready }
}
