import { useEffect, useState } from 'react'
import { useAppDispatch } from './useStore'
import { setAuth } from '@/store/user'
import { useRefreshQuery } from '@/store/api/auth'

export function useRefresh() {
	const [ready, setReady] = useState(false)

	const { data, isError } = useRefreshQuery(undefined)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isError && data) dispatch(setAuth(data.data))
		setReady(true)
	}, [data, isError, dispatch])

	return { ready }
}
