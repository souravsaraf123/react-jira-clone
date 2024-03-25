import "./About.css";

import SVG from 'react-inlinesvg';

export function About()
{
	return (
		<div className="about">
			<img style={{ marginInline: "auto" }} src="src/assets/images/feedback.png" width={140} />
			<p>
				This simplified Jira clone is built with React on the front-end and Node/TypeScript on the back-end.
			</p>
			<p>
				Contact me at <a href="mailto:souravsaraf1230@gmail.com">souravsaraf1230@gmail.com</a>
			</p>

			<div className="links">
				<a className="primary" target="_blank" href="https://www.linkedin.com/in/sourav-saraf-a8a33752">LinkedIn</a>
				<a className="secondary" target="_blank" href="https://github.com/souravsaraf123/react-jira-clone">
					<SVG src="src/assets/images/github.svg" width={16} height={16}></SVG>
					<span>Github Repo</span>
				</a>
			</div>
		</div>
	);
}