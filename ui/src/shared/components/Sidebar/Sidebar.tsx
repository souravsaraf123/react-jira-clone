import "./Sidebar.css";

import { Button, ButtonFilled, ButtonPalette, ButtonProps, ButtonSize } from "../Button/Button";

import { IconButton } from "../IconButton";
import SVG from 'react-inlinesvg';

export function Sidebar()
{
	let homeIcon = "src/assets/images/jira_light.svg";
	let searchIcon = "src/assets/images/search.svg";
	let plusIcon = "src/assets/images/plus.svg";
	let helpIcon = "src/assets/images/help.svg";

	let height = 28;
	let width = 28;

	let myStyle = {
		backgroundColor: "transparent !important",
	};
	let props: Partial<ButtonProps> = {
		filled: ButtonFilled.filled,
		size: ButtonSize.regular,
		palette: ButtonPalette.primary,
		style: myStyle,
		className: "sidebar_button",
	};

	return (
		<aside>
			<div className="sidebar">

				{/* Home */}
				<Button
					{...props}
					onClick={() => alert("Home")}>
					<SVG src={homeIcon} height={32} width={32} />
				</Button>

				{/* Search */}
				<Button
					{...props}
					onClick={() => alert("Search")}>
					<SVG src={searchIcon} height={height} width={width} />
				</Button>

				{/* New Issue */}
				<Button
					{...props}
					onClick={() => alert("New Issue")}>
					<SVG src={plusIcon} height={height} width={width} />
				</Button>

				{/* Help */}
				<Button
					{...props}
					onClick={() => alert("Help")}>
					<SVG src={helpIcon} height={height} width={width} />
				</Button>
			</div>
		</aside>
	);
}