import "./IssueDetailsLhs.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";

import { Comments } from "../Comments/Comments";
import { IssueWithUsersAndComments } from "../../models/issue.model";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from "react";

interface IssueDetailsLhsProps
{
	issueDetails: IssueWithUsersAndComments;
	setIssueDetails: React.Dispatch<React.SetStateAction<IssueWithUsersAndComments>>;
	updateIssueDetails: (requestBody: Partial<IssueWithUsersAndComments>) => void;
}

export function IssueDetailsLhs(props: IssueDetailsLhsProps)
{
	let [issueTitle, setIssueTitle] = useState<string>(props.issueDetails.title);
	let [issueDescription, setIssueDescription] = useState<string>(props.issueDetails.description);
	let [showDescrSaveButton, setShowDescrSaveButton] = useState<boolean>(false);
	const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
	{
		setIssueTitle(event.target.value);
	};

	return (
		<div style={{ margin: '4px' }}>

			{/* Issue Title */}
			<TextareaAutosize
				minRows={1}
				rows={1}
				maxLength={200}
				className="form_input title lhs_issue_title"
				value={issueTitle}
				onChange={handleTitleChange}
				onBlur={() =>
				{
					let requestBody: Partial<IssueWithUsersAndComments> = {
						title: issueTitle
					};
					props.updateIssueDetails(requestBody);
				}}
			/>

			{/* Description */}
			<p className="form_label">Description</p>
			<RichTextEditor
				value={issueDescription}
				onChange={(value: string) => setIssueDescription(value)}
				className="lhs_issue_description_editor"
				onFocus={() => setShowDescrSaveButton(true)}
			/>

			{/* Description Save & Cancel */}
			{showDescrSaveButton &&
				<div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>

					{/* Save Button */}
					<Button
						palette={ButtonPalette.primary}
						filled={ButtonFilled.filled}
						size={ButtonSize.small}
						onClick={() =>
						{
							let requestBody: Partial<IssueWithUsersAndComments> = {
								description: issueDescription
							};
							props.updateIssueDetails(requestBody);
							setShowDescrSaveButton(false);
						}}>
						Save
					</Button>

					{/* Cancel Button */}
					<Button
						type="button"
						filled={ButtonFilled.filled}
						palette={ButtonPalette.secondary}
						size={ButtonSize.small}
						onClick={() =>
						{
							setShowDescrSaveButton(false);
						}}>
						Cancel
					</Button>
				</div>
			}

			<Comments
				issueDetails={props.issueDetails}
				setIssueDetails={props.setIssueDetails}>
			</Comments>

		</div>
	);
}