import './assets/styles/fonts.css';
import './assets/styles/variables.css';
import './assets/styles/reset.css';
import './assets/styles/index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { Board } from './pages/Board/Board.tsx';
import { ButtonShowcase } from './pages/ButtonShowcase/ButtonShowcase.tsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.tsx';
import ProjectSettings from './pages/ProjectSettings/ProjectSettings.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "showcase",
				element: <ButtonShowcase />,
				index: true,
			},
			{
				path: "board",
				element: <Board />,
			},
			{
				path: "settings",
				element: <ProjectSettings />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
