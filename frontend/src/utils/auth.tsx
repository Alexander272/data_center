import { useAppSelector } from '@/hooks/useStore'

type Rule = {
	section: string
	method: string
}

export const CheckPermission = (rule: Rule) => {
	const user = useAppSelector(state => state.user.user)
	if (!user) return false

	for (let i = 0; i < user.menu.length; i++) {
		const r = user.menu[i]
		const parts = r.name.split(':')

		const section = parts[0]
		const method = parts[1]

		if ((section == rule.section || section == '*') && (method == rule.method || method == 'ALL')) {
			return true
		}
	}

	return false
}
