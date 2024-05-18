import "./IssueCard.css";

import { Issue, IssuePriority, IssuePriorityLabel, IssueType } from "../../models/issue.model";

import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { User } from "../../models/user.model";

export function getIssueTypeIcon(issueType: IssueType)
{
	let icon: JSX.Element;
	switch (issueType)
	{
		case IssueType.bug:
			icon = <SVG title={issueType} height={"20px"} width={"20px"} src="/src/assets/images/bug.svg"></SVG>;
			break;
		case IssueType.story:
			icon = <SVG title={issueType} height={"20px"} width={"20px"} src="/src/assets/images/story.svg"></SVG>;
			break;
		case IssueType.task:
			icon = <SVG title={issueType} height={"20px"} width={"20px"} src="/src/assets/images/task.svg"></SVG>;
			break;
		default:
			icon = <SVG title={issueType} height={"20px"} width={"20px"} src="/src/assets/images/task.svg"></SVG>;
			break;
	}
	return icon;
};

export function getIssuePriorityIcon(priority: IssuePriority)
{
	let icon: JSX.Element;
	switch (priority)
	{
		case IssuePriority.lowest:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--success)" style={{ rotate: "180deg" }} height={"20px"} width={"20px"} src="/src/assets/images/highest.svg"></SVG>;
			break;
		case IssuePriority.low:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--success)" style={{ rotate: "180deg" }} height={"20px"} width={"20px"} src="/src/assets/images/high.svg"></SVG>;
			break;
		case IssuePriority.medium:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--warning)" height={"20px"} width={"20px"} src="/src/assets/images/high.svg"></SVG>;
			break;
		case IssuePriority.high:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--danger)" height={"20px"} width={"20px"} src="/src/assets/images/high.svg"></SVG>;
			break;
		case IssuePriority.highest:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--danger)" height={"20px"} width={"20px"} src="/src/assets/images/highest.svg"></SVG>;
			break;
		default:
			icon = <SVG title={'Priority : ' + IssuePriorityLabel[priority]} color="var(--warning)" height={"20px"} width={"20px"} src="/src/assets/images/high.svg"></SVG>;
			break;
	}
	return icon;
};

export function IssueCard(props: { issue: Issue, index: number, userMap: Record<number, User> })
{

	let getAssigneeIcons = () =>
	{
		let assigneeIcons = [];
		for (let userId of props.issue.userIds)
		{
			let user = props.userMap[userId];
			assigneeIcons.push(<img src={user.avatarUrl} key={userId} alt={user.name} title={user.name} className="user_avatar" />);
		}
		return assigneeIcons;
	}
	return (
		<Draggable draggableId={props.issue.id.toString()} index={props.index}>
			{(provided, snapshot) => (
				<Link
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					to={`/board/issues/${props.issue.id}`}
					className={"issue_card" + (snapshot.isDragging ? " dragging" : "")}>
					<p>{props.issue.title}</p>

					<div className="issue_footer_row">
						{getIssueTypeIcon(props.issue.type)}
						{getIssuePriorityIcon(props.issue.priority)}

						<div className="user_container">
							{getAssigneeIcons()}
						</div>
					</div>
				</Link>
			)}
		</Draggable>
	);
}