import "./Breadcrumb.css";

import { Project } from "../../models/project.model";

export function Breadcrumb(props: { project: Project, lastPage: string })
{
	console.log('Breadcrumb : ', props);
	let lastPage = props?.lastPage || "Kanban Board";
	return (
		<div className="breadcrumb">
			<span>Projects</span>
			<span>/</span>
			<span>{props.project.name}</span>
			<span>/</span>
			<span>{lastPage}</span>
		</div>
	);
}