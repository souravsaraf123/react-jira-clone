import "react-toastify/dist/ReactToastify.css";
import './assets/styles/toastify.css';

import { Project, ProjectDetails } from "./shared/models/project.model";
import { useEffect, useRef, useState } from "react";

import { Navbar } from "./shared/components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";
import { Spinner } from "./shared/components/Spinner/Spinner";
import { ToastContainer } from "react-toastify";
import { User } from "./shared/models/user.model";
import { getProjectDetails } from "./shared/services/Project.service";
import { seedData } from "./shared/services/Auth.service";

export type ProjectWithDetailsContext = {
	project: Project | null,
	setProject: (project: Project) => void,
	projectDetails: ProjectDetails | null
};

function App()
{
	// This code will run once when the component mounts
	useEffect(() =>
	{
		// since useEffect can't be async, we define an async function inside it
		let init = async () =>
		{
			// check if user and token are already present in local storage
			let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) as User : null;
			let token = localStorage.getItem("token") ? localStorage.getItem("token") : null;

			// if user or token is not present, seed data and get user, token in response, store the user and token in local storage
			if (!user || !token)
			{
				console.log('Seeding data');
				try
				{
					let loginResponse = await seedData();
					user = loginResponse.user;
					token = loginResponse.token;
					localStorage.setItem("user", JSON.stringify(user));
					localStorage.setItem("token", token);
				}
				catch (error)
				{
					console.error('Error while seeding data : ', error);
					alert('Error while seeding data');
					setError(error);
					setIsLoading(false);
					return;
				}
			}

			// fetch project details
			try
			{
				let projectDetails = await getProjectDetails(token);
				setProjectDetails(projectDetails);
				setProject(projectDetails.project);
				setIsLoading(false);
			}
			catch (error)
			{
				console.error('Error while fetching project details : ', error);
				alert('Error while fetching project details');
				setError(error);
				setIsLoading(false);
				return;
			}
		};

		// call the async function
		init();

	}, []);

	let ref = useRef(0);
	let [isLoading, setIsLoading] = useState<boolean>(true);
	let [error, setError] = useState<any>(null);
	let [projectDetails, setProjectDetails] = useState<ProjectDetails>(null);
	let [project, setProject] = useState<Project>(null);

	ref.current = ref.current + 1;
	console.log(`App component re-rendered ${ref.current} times`);

	let loadingState = (
		<div className="center_of_body">
			<Spinner height={70} width={70} variation="dark" />
		</div>
	);

	let errorState = (
		<div className="center_of_body">
			<h1>Error</h1>
			<br />
			<p>{error?.message || JSON.stringify(error, null, 4)}</p>
		</div>
	);

	let successState = (
		<>
			<Sidebar />
			<Navbar project={project} />
			<main>
				<ToastContainer />
				<Outlet context={{
					project,
					setProject,
					projectDetails
				} satisfies ProjectWithDetailsContext} />
			</main>
		</>
	);

	let finalState = isLoading ? loadingState : error ? errorState : successState;
	return (
		<>
			{finalState}
		</>
	);
}

export default App;
