import "./IssueCard.css";

import { Issue, IssuePriority, IssueType } from "../../models/issue.model";

import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { User } from "../../models/user.model";

export function IssueCard(props: { issue: Issue, userMap: Record<number, User> })
{
	let getIssueTypeIcon = () =>
	{
		let icon: JSX.Element;
		switch (props.issue.type)
		{
			case IssueType.bug:
				icon = <SVG title={props.issue.type} height={"20px"} width={"20px"} src="src/assets/images/bug.svg"></SVG>;
				break;
			case IssueType.story:
				icon = <SVG title={props.issue.type} height={"20px"} width={"20px"} src="src/assets/images/story.svg"></SVG>;
				break;
			case IssueType.task:
				icon = <SVG title={props.issue.type} height={"20px"} width={"20px"} src="src/assets/images/task.svg"></SVG>;
				break;
			default:
				icon = <SVG title={props.issue.type} height={"20px"} width={"20px"} src="src/assets/images/task.svg"></SVG>;
				break;
		}
		return icon;
	};

	let getIssuePriorityIcon = () =>
	{
		let icon: JSX.Element;
		switch (props.issue.priority)
		{
			case IssuePriority.lowest:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--success)" style={{ rotate: "180deg" }} height={"20px"} width={"20px"} src="src/assets/images/highest.svg"></SVG>;
				break;
			case IssuePriority.low:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--success)" style={{ rotate: "180deg" }} height={"20px"} width={"20px"} src="src/assets/images/high.svg"></SVG>;
				break;
			case IssuePriority.medium:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--warning)" height={"20px"} width={"20px"} src="src/assets/images/high.svg"></SVG>;
				break;
			case IssuePriority.high:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--danger)" height={"20px"} width={"20px"} src="src/assets/images/high.svg"></SVG>;
				break;
			case IssuePriority.highest:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--danger)" height={"20px"} width={"20px"} src="src/assets/images/highest.svg"></SVG>;
				break;
			default:
				icon = <SVG title={'Priority : ' + props.issue.priority} color="var(--warning)" height={"20px"} width={"20px"} src="src/assets/images/high.svg"></SVG>;
				break;
		}
		return icon;
	};

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
		<Link
			to={`/board/issues/${props.issue.id}`}
			className="issue_card">
			<p>{props.issue.title}</p>

			<div className="issue_footer_row">
				{getIssueTypeIcon()}
				{getIssuePriorityIcon()}

				<div className="user_container">
					{getAssigneeIcons()}
				</div>
			</div>
		</Link>
	);
}