import "./Spinner.css";

import SVG from "react-inlinesvg";

export function Spinner(props: { height: number, width: number; })
{
	let height = props.height || 24;
	let width = props.width || 24;

	return (
		<SVG className="spinner" src="src/assets/images/spinner.svg" height={height} width={width} />
	);
}