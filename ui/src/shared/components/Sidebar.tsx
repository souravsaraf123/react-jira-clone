import "./Sidebar.css";

import { IconButton } from "./IconButton";

export function Sidebar()
{
	let homeIcon = "src/assets/images/jira_light.svg";
	let searchIcon = "src/assets/images/search.svg";
	let plusIcon = "src/assets/images/plus.svg";
	let helpIcon = "src/assets/images/help.svg";

	let height = 28;
	let width = 28;

	return (
		<aside className="sidebar">
			<IconButton icon={homeIcon} height={32} width={32} onClick={() => alert("Home")} />
			<IconButton icon={plusIcon} height={height} width={width} onClick={() => alert("New Issue")} />
			<IconButton icon={searchIcon} height={height} width={width} onClick={() => alert("Search")} />
			<IconButton icon={helpIcon} height={height} width={width} onClick={() => alert("Help")} />
		</aside>
	);
}