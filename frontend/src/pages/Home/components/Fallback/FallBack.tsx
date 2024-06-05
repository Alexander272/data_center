import { Fallback } from '@/components/Fallback/Fallback'

export const TableFallBack = () => {
	return (
		<Fallback
			position={'absolute'}
			top={'50%'}
			left={'50%'}
			transform={'translate(-50%, -50%)'}
			height={160}
			width={160}
			borderRadius={3}
			zIndex={15}
			backgroundColor={'#fafafa'}
		/>
	)
}
