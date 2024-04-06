import "./Board.css";

import { Breadcrumb } from "../../shared/components/Breadcrumb/Breadcrumb";
import { GithubLink } from "../../shared/GithubLink/GithubLink";
import { ProjectContextType } from "../../App";
import { useOutletContext } from "react-router-dom";

export function Board()
{
	let [project, setProject]: any = useOutletContext<ProjectContextType>();
	return (
		<div className="board_container">

			{/* Header Container */}
			<div>

				{/* Breadcrumb */}
				<Breadcrumb project={project} lastPage="Kanban Board" />

				{/* Title Container */}
				<div style={{ display: "flex", justifyContent: "space-between" }}>

					{/* Title */}
					<span className="title">Kanban Board</span>

					{/* Github Link */}
					<GithubLink />

				</div>

			</div>

			{/* Search & Filter Container */}
			<div className="search_filter_container">

				{/* Search Input */}
				<input
					className="form_input search_input"
					placeholder="Search Issue Title"
					type="search" />

			</div>

		</div>
	);
}