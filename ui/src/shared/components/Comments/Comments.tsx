import "./Comments.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";
import { createComment, deleteComment, updateComment } from "../../services/Comment.service";
import { useEffect, useRef, useState } from "react";

import { IssueWithUsersAndComments } from "../../models/issue.model";
import TextareaAutosize from 'react-textarea-autosize';
import { User } from "../../models/user.model";
import { UserComment } from "../../models/userComment.model";
import { ViewComment } from "../ViewComment/ViewComment";
import { toast } from "react-toastify";

interface IssueDetailsLhsProps
{
	issueDetails: IssueWithUsersAndComments;
	setIssueDetails: React.Dispatch<React.SetStateAction<IssueWithUsersAndComments>>;
}

export function Comments(props: IssueDetailsLhsProps)
{
	// state
	let [showCommentSaveButton, setShowCommentSaveButton] = useState<boolean>(false);
	let [newComment, setNewComment] = useState<string>('');
	let newCommentRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() =>
	{
		document.addEventListener("keyup", focusNewComment, false);

		return () =>
		{
			document.removeEventListener("keyup", focusNewComment, false);
		}
	}, []);

	// local variables
	let loggedInUser: User = JSON.parse(localStorage.getItem('user') || '{}');
	let focusNewComment: any = (event: KeyboardEvent) =>
	{
		// if the user presses the 'm' key
		if (
			!(event.target instanceof HTMLInputElement) &&
			!(event.target instanceof HTMLTextAreaElement) &&
			!(event.target instanceof HTMLDivElement && event.target.isContentEditable) &&
			event.key === 'm'
		)
		{
			// focus the new comment textarea
			newCommentRef?.current.focus();
		}
	}
	const addUpdateOrDeleteComment = async (userComment: Partial<UserComment>) =>
	{
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			let response: UserComment;
			if (userComment.id)
			{
				// if the user is deleting the comment
				if (Object.keys(userComment).length === 1)
				{
					response = await deleteComment(token, userComment.id);
					props.setIssueDetails({
						...props.issueDetails,
						comments: props.issueDetails.comments.filter((comment) => comment.id !== userComment.id),
					});
				}
				// if the user is updating the comment
				else
				{
					response = await updateComment(token, userComment.id, userComment);
					props.setIssueDetails({
						...props.issueDetails,
						comments: props.issueDetails.comments.map((comment) => comment.id === userComment.id ? response : comment),
					});
				}
			}
			// if the user is adding a new comment
			else
			{
				response = await createComment(token, userComment);
				props.setIssueDetails({
					...props.issueDetails,
					comments: [...props.issueDetails.comments, response],
				});
			}
			console.log('Comment updated successfully : ', response);
			return true;
		}
		catch (error: any)
		{
			// toast
			console.error('Error while updating comment : ', error);
			let errorMsg = error?.message || JSON.stringify(error, null, 4);
			let toastMsg = ['Failed to update comment', errorMsg].filter(Boolean).join('\n');
			toast(toastMsg, {
				type: "error",
				theme: "colored",
			});
			return false;
		}
	}

	return (
		<>
			{/* Comments */}
			<p className="form_label" style={{ marginBlock: '1.75em' }}>Comments</p>

			{/* Add New Comment */}
			<div className="add_comment_container">
				<img src={loggedInUser.avatarUrl} className="comment_avatar" />

				<div>

					<TextareaAutosize
						ref={newCommentRef}
						placeholder="Add a comment..."
						minRows={1}
						rows={2}
						maxLength={50000}
						className="form_input new_comment_textarea"
						value={newComment}
						onChange={(event) => setNewComment(event.target.value)}
						onFocus={() =>
						{
							setShowCommentSaveButton(true);
						}}
					/>

					{/* New Comment Save & Cancel */}
					{showCommentSaveButton ? (
						<div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>

							{/* Save Button */}
							<Button
								palette={ButtonPalette.primary}
								filled={ButtonFilled.filled}
								size={ButtonSize.small}
								onClick={async () =>
								{
									let requestBody: Partial<UserComment> = {
										body: newComment,
										issueId: props.issueDetails.id,
										userId: loggedInUser.id,
									};
									let isSuccessful = await addUpdateOrDeleteComment(requestBody);
									if (isSuccessful)
									{
										setNewComment('');
										setShowCommentSaveButton(false);
									}
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
									setNewComment('');
									setShowCommentSaveButton(false);
								}}>
								Cancel
							</Button>
						</div>
					) :
						(
							<div className="pro_tip">
								<strong>Pro tip: </strong>
								<span>press</span>
								<span className="keyboard">M</span>
								<span>to comment</span>
							</div>
						)
					}

				</div>
			</div>

			{/* Comments List */}
			{
				props.issueDetails.comments.map((comment) => (
					<ViewComment
						key={comment.id}
						issueDetails={props.issueDetails}
						setIssueDetails={props.setIssueDetails}
						addUpdateOrDeleteComment={addUpdateOrDeleteComment}
						userComment={comment}
					/>
				))
			}
		</>
	);
}