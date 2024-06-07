import { MouseEvent } from 'react'

import type { IStep } from './step.type'
import { Step } from './Step'
import { Container } from './stepper.style'

type Props = {
	active: string
	data: IStep[]
	width?: string
	onSelect: (key: string) => void
}

export default function Stepper({ active, data, width, onSelect }: Props) {
	const selectHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { id } = (event.target as HTMLDivElement).dataset
		if (!id) return

		onSelect(id)
	}

	return (
		<Container width={width} onClick={selectHandler}>
			{data.map(d => (
				<Step key={d.id} id={d.key} label={d.label} complete={d.complete} active={active == d.key} />
			))}
		</Container>
	)
}
