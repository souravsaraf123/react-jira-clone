import './assets/styles/fonts.css';
import './assets/styles/variables.css';
import './assets/styles/reset.css';
import './assets/styles/index.css';

import App from './App.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
