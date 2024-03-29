import { useEffect, useRef, useState } from "react";

import { Navbar } from "./shared/components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { ProjectDetails } from "./shared/models/project.model";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";
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
			let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("currentUser")) as User : null;
			let token = localStorage.getItem("token") ? localStorage.getItem("token") : null;

			// if user or token is not present, seed data and get user, token in response, store the user and token in local storage
			if (!user || !token)
			{
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
					return;
				}
			}

			// fetch project details
			try
			{
				let projectDetails = await getProjectDetails(token);
				setProjectDetails(projectDetails);
			}
			catch (error)
			{
				console.error('Error while fetching project details : ', error);
				alert('Error while fetching project details');
				return;
			}
		};

		// call the async function
		init();

	}, []);

	let ref = useRef(0);
	let [projectDetails, setProjectDetails] = useState<ProjectDetails>(null);

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
