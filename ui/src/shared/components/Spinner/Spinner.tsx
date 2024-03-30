import "./Spinner.css";

import SVG from "react-inlinesvg";

export function Spinner(props: { height: number, width: number; variation?: "light" | "dark" })
{
	let variation = props.variation || "light";
	let src = (variation === "light") ? "src/assets/images/spinner.svg" : "src/assets/images/spinner_dark.svg";
	let height = props.height || 24;
	let width = props.width || 24;

	return (
		<SVG className="spinner" src={src} height={height} width={width} />
	);
}