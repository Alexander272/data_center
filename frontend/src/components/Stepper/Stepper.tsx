import { MouseEvent } from 'react'
import type { IStep } from './step.type'
import { Container } from './stepper.style'
import { Step } from './Step'

type Props = {
	active: string
	data: IStep[]
	width?: string
	onSelect: (key: string) => void
}

export default function Stepper({ active, data, width, onSelect }: Props) {
	//TODO надо наверное это в хук засунуть
	// const [finish, setFinish] = useState(false)
	// const [active, setActive] = useState(data[0].id)

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
