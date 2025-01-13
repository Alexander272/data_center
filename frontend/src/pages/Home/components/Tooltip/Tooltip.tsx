import { TooltipOption } from 'echarts/types/dist/shared.js'

export const tooltip: TooltipOption = {
	trigger: 'axis',
	axisPointer: {
		type: 'shadow',
	},
	formatter: params => {
		if (!Array.isArray(params)) return ''

		const title = `Дата: ${params[0].name}`

		const lines = []

		for (let i = 0; i < params.length / 2; i++) {
			const idx = i + params.length / 2

			const value1 = new Intl.NumberFormat('ru').format(+(params[idx]?.value || 0))
			const line1 = `<span style="margin-left:2px">${params[idx]?.seriesName || ''}: <b>${value1}</b></span>`
			const value2 = new Intl.NumberFormat('ru').format(+(params[idx]?.value || 0) + +(params[i]?.value || 0))
			const line2 = `<span style="margin-left:16px">Всего (${
				params[idx]?.seriesName || ''
			}): <b>${value2}</b></span>`

			const dot = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
				params[idx]?.color?.toString() || ''
			};"></span>`

			lines.push('<br/>' + dot + line1 + '<br/>' + line2)
		}

		return title + lines.join('')
	},
}
