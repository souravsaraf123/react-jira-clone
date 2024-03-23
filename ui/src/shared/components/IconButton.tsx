import SVG from 'react-inlinesvg';

export function IconButton(props: { icon: string; height: number, width: number; onClick: () => void; })
{
	let height = props.height || 24;
	let width = props.width || 24;
	return (
		<button style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }} onClick={props.onClick}>
			<SVG src={props.icon} height={height} width={width} />
		</button>
	);
}