import { Breadcrumb } from "../../shared/components/Breadcrumb/Breadcrumb";
import { ProjectContextType } from "../../App";
import { useOutletContext } from "react-router-dom";

export default function ProjectSettings()
{
	let [project, setProject]: any = useOutletContext<ProjectContextType>();
	return (
		<div>
			<Breadcrumb project={project} lastPage="Project Details" />
		</div>
	);
};