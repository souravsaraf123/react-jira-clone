import "./GithubLink.css";

import SVG from 'react-inlinesvg';

export function GithubLink()
{
	return (
		<a
			className="github"
			target="_blank"
			href="https://github.com/souravsaraf123/react-jira-clone">
			<SVG src="src/assets/images/github.svg" width={16} height={16}></SVG>
			<span>Github Repo</span>
		</a>
	);
}