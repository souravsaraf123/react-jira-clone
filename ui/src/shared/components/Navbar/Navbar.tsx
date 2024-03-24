import "./Navbar.css";

import { Button, ButtonFilled, ButtonPalette } from "../Button/Button";

import SVG from "react-inlinesvg";
import { useNavigate } from "react-router-dom";

export function Navbar()
{
	let navigate = useNavigate();
	let projectName = "singularity 1.0";
	let projectCategory = "Software project";
	let projectIcon = "src/assets/images/project_icon.svg";

	function navigateTo(url: string)
	{
		navigate(url);
	}

	let notImplementedLinks = [
		{
			icon: "src/assets/images/releases.svg",
			text: "Releases"
		},
		{
			icon: "src/assets/images/issues.svg",
			text: "Issues and filters"
		},
		{
			icon: "src/assets/images/pages.svg",
			text: "Pages"
		},
		{
			icon: "src/assets/images/reports.svg",
			text: "Reports"
		},
		{
			icon: "src/assets/images/components.svg",
			text: "Components"
		}
	];

	let notImplemented = notImplementedLinks.map(l =>
	{
		return (
			<Button disabled key={l.text} className="nav_link_button not_implemented" filled={ButtonFilled.filled} palette={ButtonPalette.ghost}>
				<SVG src={l.icon} width={24} height={24} />
				<p>{l.text}</p>
				<span>Not Implemented</span>
			</Button>
		);
	});

	return (
		<nav className="navbar">

			{/* Project Name */}
			<div className="project_name_container">
				<SVG src={projectIcon} width={40} height={40} />
				<div>
					<p className="project_name">{projectName}</p>
					<p className="project_category">{projectCategory}</p>
				</div>
			</div>

			{/* Kanban Board */}
			<Button
				className="nav_link_button"
				filled={ButtonFilled.filled}
				palette={ButtonPalette.ghost}
				onClick={() => navigateTo("/board")}
			>
				<SVG src="src/assets/images/board.svg" width={24} height={24} />
				<p>Kanban Board</p>
			</Button>

			{/* Project Settings */}
			<Button
				className="nav_link_button"
				filled={ButtonFilled.filled}
				palette={ButtonPalette.ghost}
				onClick={() => navigateTo("/settings")}
			>
				<SVG src="src/assets/images/settings.svg" width={24} height={24} />
				<p>Project Settings</p>
			</Button>

			{/* Separator */}
			<div className="nav_separator"></div>

			{notImplemented}

		</nav>
	);
}