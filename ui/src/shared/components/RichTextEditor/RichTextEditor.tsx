import "./RichTextEditor.css";
import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';

export function RichTextEditor(props: { value: string, onChange: (value: string) => void, className?: string, style?: React.CSSProperties })
{
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],
		['link'],

		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

		// @ts-expect-error
		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

		['clean']                                         // remove formatting button
	];
	let modules = {
		toolbar: toolbarOptions,
	};
	return (
		<ReactQuill
			className={props.className}
			style={props.style}
			theme="snow"
			modules={modules}
			value={props.value}
			onChange={props.onChange}
		/>
	);
}