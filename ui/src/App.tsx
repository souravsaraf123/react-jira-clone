import { useEffect, useRef, useState } from "react";

import { Constants } from "./shared/Constants";
import { Navbar } from "./shared/components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Project } from "./shared/models/project.model";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";

function App()
{
	// This code will run once when the component mounts
	useEffect(() =>
	{
		let fetchProject = async () =>
		{
			let response = await fetch(`${Constants.API_URL}/project`, {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
			});
			console.log('Api response for GET project : ', response);
			let project = await response.json();
			setProject(project);
		}
		fetchProject();
	}, []);

	let ref = useRef(0);
	let [project, setProject] = useState<Project>(null);

	ref.current = ref.current + 1;
	console.log(`App component re-rendered ${ref.current} times`);
	return (
		<>
			<Sidebar />
			<Navbar />
			<main>
				<Outlet />
			</main>
		</>
	);
}

export default App;
