import "./ViewComment.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";

import ConfirmDelete from "../ConfirmDeleteIssue/ConfirmDeleteIssue";
import { IssueWithUsersAndComments } from "../../models/issue.model";
import ReactModal from "react-modal";
import TextareaAutosize from 'react-textarea-autosize';
import { User } from "../../models/user.model";
import { UserComment } from "../../models/userComment.model";
import moment from "moment";
import { useState } from "react";

interface ViewCommentProps
{
	issueDetails: IssueWithUsersAndComments;
	setIssueDetails: React.Dispatch<React.SetStateAction<IssueWithUsersAndComments>>;
	addUpdateOrDeleteComment: (userComment: Partial<UserComment>) => Promise<boolean>;
	userComment: UserComment;
}

export function ViewComment(props: ViewCommentProps)
{
	// state
	let [commentBody, setCommentBody] = useState<string>(props.userComment.body);
	let [isEditing, setIsEditing] = useState<boolean>(false);
	let [deleteCommentModalIsOpen, setDeleteCommentModalIsOpen] = useState<boolean>(false);

	// local variables
	let loggedInUser: User = JSON.parse(localStorage.getItem('user') || '{}');
	let lastUpdated = moment(props.userComment.updatedAt).fromNow();
	let deleteCommentById = async () =>
	{
		await props.addUpdateOrDeleteComment({ id: props.userComment.id });
	}

	let saveAndCancel = (

		<>

			{/* Textarea to edit comment */}
			<TextareaAutosize
				placeholder="Enter your comment here..."
				disabled={!isEditing}
				minRows={1}
				rows={2}
				maxLength={50000}
				className="form_input view_comment_textarea"
				value={commentBody}
				onChange={(event) => setCommentBody(event.target.value)}
			/>

			{/* Save & Cancel Buttons */}
			<div style={{ display: 'flex', gap: '1em' }}>

				{/* Save Button */}
				<Button
					palette={ButtonPalette.primary}
					filled={ButtonFilled.filled}
					size={ButtonSize.small}
					onClick={async () =>
					{
						if (!commentBody)
						{
							// revert back to original comment body
							setCommentBody(props.userComment.body);
							setIsEditing(false);
							return;
						}

						let requestBody: Partial<UserComment> = {
							id: props.userComment.id,
							body: commentBody,
						};
						let isSuccessful = await props.addUpdateOrDeleteComment(requestBody);
						if (!isSuccessful)
						{
							setCommentBody(props.userComment.body);
						}
						setIsEditing(false);
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
						if (!commentBody)
						{
							// revert back to original comment body
							setCommentBody(props.userComment.body);
						}
						setIsEditing(false);
					}}>
					Cancel
				</Button>
			</div>

		</>
	);

	let editAndDelete = (
		<>

			{/* Comment Body */}
			<p className="view_comment_body">{commentBody}</p>

			{/* Edit & Delete Buttons */}
			<div style={{ display: 'flex', gap: '1em' }}>

				{/* Edit Button */}
				<Button
					palette={ButtonPalette.primary}
					filled={ButtonFilled.link}
					size={ButtonSize.small}
					className="edit_button_style"
					onClick={() =>
					{
						setIsEditing(true);
					}}>
					Edit
				</Button>

				{/* Delete Button */}
				<Button
					type="button"
					filled={ButtonFilled.link}
					palette={ButtonPalette.danger}
					size={ButtonSize.small}
					className="edit_button_style"
					onClick={async () =>
					{
						setDeleteCommentModalIsOpen(true);
					}}>
					Delete
				</Button>
				{/* Confirm Delete Modal */}
				<ReactModal
					isOpen={deleteCommentModalIsOpen}
					appElement={document.getElementById("root") as HTMLElement}
					shouldCloseOnEsc={true}
					// onRequestClose={() => navigate("/board")}
					style={{
						overlay: {
							backgroundColor: "rgba(0, 0, 0, 0.5)",
						},
						content: {
							top: "50%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							transform: "translateX(-50%) translateY(-50%)",
							width: "auto",
							maxWidth: "60rem",
							minWidth: "min(30rem, 100vw)",
							minHeight: "10rem",
							padding: "1em 1.5em",
						},
					}}>
					<ConfirmDelete
						questionToAsk={`Are you sure you want to delete this comment ?`}
						setIssueDeleteModalIsOpen={setDeleteCommentModalIsOpen}
						deleteIssueFunction={deleteCommentById}>
					</ConfirmDelete>
				</ReactModal>
			</div>
		</>
	);

	return (

		// Comment Container
		<div className="view_comment_container">

			{/* User Avatar */}
			<img src={loggedInUser.avatarUrl} className="comment_avatar" />

			<div>

				<div className="name_and_time">
					{/* User Name */}
					<span className="comment_user_name">{loggedInUser.name}</span>
					{/* Comment Date */}
					<span className="comment_time" title={props.userComment.updatedAt}>{lastUpdated}</span>
				</div>



				{/* Buttons */}
				{isEditing ? saveAndCancel : editAndDelete}

			</div>
		</div >
	);
}