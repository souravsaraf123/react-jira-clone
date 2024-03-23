import "./ButtonShowcase.css"

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../../shared/components/Button/Button";

export const ButtonShowcase = () =>
{
	let buttonRows = [];
	for (let filled of Object.values(ButtonFilled))
	{
		for (let palette of Object.values(ButtonPalette))
		{
			let buttonsToDisplay = [];
			for (let size of Object.values(ButtonSize))
			{
				let key = `${filled}-${size}-${palette}`;
				buttonsToDisplay.push(
					<Button
						key={key}
						palette={palette}
						size={size}
						filled={filled}
					>Button</Button>
				);
			}
			buttonRows.push(<div className="button_row" key={`${filled}-${palette}`}>{buttonsToDisplay}</div>);
		}
	}
	return (
		<div className="button_row_container">
			{buttonRows}
		</div>
	)
}
