import { useEffect, useRef, useState } from "react";

import { Navbar } from "./shared/components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { ProjectDetails } from "./shared/models/project.model";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";
import { Spinner } from "./shared/components/Spinner/Spinner";
import { User } from "./shared/models/user.model";
import { getProjectDetails } from "./shared/services/Project.service";
import { seedData } from "./shared/services/Auth.service";

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

			console.log('User from localstorage : ', user);
			console.log('Token from localstorage : ', token);

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
				console.time('getProjectDetails');
				let projectDetails = await getProjectDetails(token);
				console.timeEnd('getProjectDetails');
				setProjectDetails(projectDetails);
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

	ref.current = ref.current + 1;
	console.log(`App component re-rendered ${ref.current} times`);

	let loadingState = (
		<div className="center_of_body">
			<Spinner height={70} width={70} />
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
			<Navbar project={projectDetails?.project} />
			<main>
				<Outlet />
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
