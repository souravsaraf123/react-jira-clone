import { Navbar } from "./shared/components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";

function App()
{
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
