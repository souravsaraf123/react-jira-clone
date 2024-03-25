import "./Sidebar.css";

import { Button, ButtonFilled, ButtonPalette, ButtonProps, ButtonSize } from "../Button/Button";

import { About } from "./About/About";
import { Popover } from 'react-tiny-popover';
import SVG from 'react-inlinesvg';
import { useState } from "react";

export function Sidebar()
{
	let [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
				<span>SEARCH ISSUES</span>
			</Button>

			{/* New Issue */}
			<Button
				{...props}
				onClick={() => alert("New Issue")}>
				<SVG src={plusIcon} height={height} width={width} />
				<span>CREATE ISSUE</span>
			</Button>

			{/* Help */}
			<Popover
				isOpen={isPopoverOpen}
				onClickOutside={() => setIsPopoverOpen(false)}
				positions={['right']}
				align="end"
				padding={10}
				content={<About />}>
				<Button
					onClick={() => setIsPopoverOpen(!isPopoverOpen)}
					{...props}>
					<SVG src={helpIcon} height={height} width={width} />
					<span>ABOUT</span>
				</Button>
			</Popover>

		</aside>
	);
}