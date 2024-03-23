import { ButtonShowcase } from "./pages/ButtonShowcase/ButtonShowcase";
import { Navbar } from "./shared/components/Navbar/Navbar";
import { Sidebar } from "./shared/components/Sidebar/Sidebar";

function App()
{
	return (
		<>
			<Sidebar />
			<Navbar />
			<ButtonShowcase />
		</>
	);
}

export default App;
