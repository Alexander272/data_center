import { useAppSelector } from '@/hooks/useStore'
import { getMenu } from '@/store/user'

export const useCheckPermission = (rule: string) => {
	const menu = useAppSelector(getMenu)
	if (!menu?.length) return false

	// for (let i = 0; i < menu.length; i++) {
	// 	if (menu[i] === rule) return true
	// }
	// return false
	return menu.includes(rule)
}

// export const CheckPermission = (rule: string) => {
// 	const menu = useAppSelector(getMenu)
// 	if (!menu?.length) return false

// 	return menu.includes(rule)
// }
