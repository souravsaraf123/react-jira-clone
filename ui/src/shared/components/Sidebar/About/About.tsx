import "./About.css";

import { GithubLink } from "../../GithubLink/GithubLink";
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
				<GithubLink />
			</div>
		</div>
	);
}