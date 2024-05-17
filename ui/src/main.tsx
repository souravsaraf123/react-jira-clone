import './assets/styles/fonts.css';
import './assets/styles/variables.css';
import './assets/styles/reset.css';
import './assets/styles/index.css';

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { Board } from './pages/Board/Board.tsx';
import { ButtonShowcase } from './pages/ButtonShowcase/ButtonShowcase.tsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.tsx';
import ProjectSettings from './pages/ProjectSettings/ProjectSettings.tsx';
import ReactDOM from 'react-dom/client';

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Navigate to="board" />,
			},
			{
				path: "showcase",
				element: <ButtonShowcase />,
			},
			{
				path: "board",
				element: <Board />,
				children: [
					{
						path: "createIssue",
						element: <Board />,
					},
					{
						path: "issues",
						element: <Board />,
					},
					{
						path: "issues/:issueId",
						element: <Board />,
					},
				],
			},
			{
				path: "settings",
				element: <ProjectSettings />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router} />
);
