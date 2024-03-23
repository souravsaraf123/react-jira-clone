import "./Navbar.css";

import SVG from "react-inlinesvg";

export function Navbar()
{

	let projectName = "singularity 1.0";
	let projectCategory = "Software project";
	let projectIcon = "src/assets/images/project_icon.svg";
	return (
		<nav className="navbar">
			<div className="project_name_container">
				<SVG src={projectIcon} width={40} height={40} />
				<div>
					<p className="project_name">{projectName}</p>
					<p className="project_category">{projectCategory}</p>
				</div>
			</div>
		</nav>
	);
}