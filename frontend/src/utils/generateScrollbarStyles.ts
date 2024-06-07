export interface IScrollbarParameters {
	scrollbarWidth: string
	scrollbarHeight: string
	scrollbarBgColor: string
	thumbColor: string
	thumbColorHover: string
	thumbColorActive: string
	borderRadius: string
}

export const generateScrollbarStyles = (parameters: IScrollbarParameters) => {
	const {
		borderRadius,
		scrollbarHeight,
		scrollbarWidth,
		scrollbarBgColor,
		thumbColor,
		thumbColorActive,
		thumbColorHover,
	} = parameters

	return `
  	* {
    	scrollbar-color: ${thumbColor} ${scrollbarBgColor};
    	scrollbar-width: thin;
  	}
	*::-webkit-scrollbar {
		background-color: ${scrollbarBgColor};
		width: ${scrollbarWidth};
		idth: 1rem !important;
		height: ${scrollbarHeight}!important; 
	}
	*::-webkit-scrollbar-corner {
		background-color: ${scrollbarBgColor};
	}
	*::-webkit-scrollbar-thumb {
		border-width: 0.25rem;
		border-style: solid;
		border-color: transparent;
		border-image: initial;
		border-radius: 0.5rem;
		background: content-box rgba(186, 193, 205, 0.7) !important;

		background-color: ${thumbColor};
		border-radius: ${borderRadius};
	}
	*::-webkit-scrollbar-thumb:hover {
		background-color: ${thumbColorHover};
	}
	*::-webkit-scrollbar-thumb:active {
		background-color: ${thumbColorActive};
	}
	`
}
