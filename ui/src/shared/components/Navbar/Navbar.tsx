import "./Navbar.css";

import { Button, ButtonFilled, ButtonPalette } from "../Button/Button";
import { useMatch, useNavigate } from "react-router-dom";

import { Project } from "../../models/project.model";
import SVG from "react-inlinesvg";

export function Navbar(props: { project: Project })
{
	let navigate = useNavigate();
	let projectName = props?.project?.name;
	let category = props?.project?.category;
	let projectCategory = category?.charAt(0)?.toUpperCase() + category?.substring(1) + " project";
	let projectIcon = "src/assets/images/project_icon.svg";

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
				className={"nav_link_button" + (useMatch("/board") ? " active" : "")}
				filled={ButtonFilled.filled}
				palette={ButtonPalette.ghost}
				onClick={() => navigate("/board")}
			>
				<SVG src="src/assets/images/board.svg" width={24} height={24} />
				<p>Kanban Board</p>
			</Button>

			{/* Project Settings */}
			<Button
				className={"nav_link_button" + (useMatch("/settings") ? " active" : "")}
				filled={ButtonFilled.filled}
				palette={ButtonPalette.ghost}
				onClick={() => navigate("/settings",)}
			>
				<SVG src="src/assets/images/settings.svg" width={24} height={24} />
				<p>Project Settings</p>
			</Button>

			{/* Separator */}
			<div className="nav_separator"></div>

			{notImplemented}

			{/* Components */}
			<Button
				className={"nav_link_button" + (useMatch("/showcase") ? " active" : "")}
				filled={ButtonFilled.filled}
				palette={ButtonPalette.ghost}
				onClick={() => navigate("/showcase")}
			>
				<SVG src="src/assets/images/components.svg" width={24} height={24} />
				<p>Components</p>
			</Button>

		</nav>
	);
}