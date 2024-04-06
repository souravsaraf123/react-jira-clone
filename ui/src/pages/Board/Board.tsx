import "./Board.css";

import { Button, ButtonPalette, ButtonSize } from "../../shared/components/Button/Button";
import { Issue, IssueStatus } from "../../shared/models/issue.model";

import { Breadcrumb } from "../../shared/components/Breadcrumb/Breadcrumb";
import { GithubLink } from "../../shared/components/GithubLink/GithubLink";
import { IssueCard } from "../../shared/components/IssueCard/IssueCard";
import { ProjectWithDetailsContext } from "../../App";
import { User } from "../../shared/models/user.model";
import _ from "lodash";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

let statusTextMap: Record<IssueStatus, string> = {
	[IssueStatus.backlog]: "Backlog",
	[IssueStatus.selected]: "Selected for Development",
	[IssueStatus.inprogress]: "In Progress",
	[IssueStatus.done]: "Done",
};

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export function Board()
{
	let { project, projectDetails } = useOutletContext<ProjectWithDetailsContext>();
	let [issues, setIssues] = useState(projectDetails.issues);
	let [searchTerm, setSearchTerm] = useState("");
	let [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	let [onlyMyIssues, setOnlyMyIssues] = useState(false);
	let [recentlyUpdated, setRecentlyUpdated] = useState(false);

	let userMap: Record<number, User> = _.keyBy(projectDetails.users, (u) => u.id);
	let filteredIssues = searchAndFilter(issues, searchTerm, selectedUsers, onlyMyIssues, recentlyUpdated);
	let issuesGroupedByStatus = _.groupBy(filteredIssues, (i) => i.status);
	let isAnyFilterApplied = searchTerm || selectedUsers.length > 0 || onlyMyIssues || recentlyUpdated;

	// Toggle selected user avatar
	function toggleSelectedUser(id: number)
	{
		if (selectedUsers.includes(id))
		{
			setSelectedUsers(selectedUsers.filter(u => u !== id));
		}
		else
		{
			setSelectedUsers([...selectedUsers, id]);
		}
	}

	// Search and filter issues
	function searchAndFilter(issues: Issue[], searchTerm: string, selectedUsers: number[], onlyMyIssues: boolean, recentlyUpdated: boolean)
	{
		let currentUserId = (JSON.parse(localStorage.getItem("user")) as User).id;
		let filteredIssues = issues.filter(i =>
		{
			let matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase());
			let isAssignedToSelectedUsers = selectedUsers.length === 0 || _.intersection(i.userIds, selectedUsers).length > 0;
			let isAssignedToMe = i.userIds.includes(currentUserId);
			let isRecentlyUpdated = recentlyUpdated ? Date.parse(i.updatedAt) > Date.now() - TWO_DAYS : true;
			return matchesSearch && isAssignedToSelectedUsers && (onlyMyIssues ? isAssignedToMe : true) && isRecentlyUpdated;
		});
		return filteredIssues;
	}

	// Render status columns
	let statusColumns = [];
	for (let status of Object.values(IssueStatus))
	{
		let currentIssues = issuesGroupedByStatus[status];
		if (!currentIssues)
		{
			currentIssues = [];
		}

		statusColumns.push(
			<div className="status_container" key={status}>
				<p className="status_title">{statusTextMap[status]} {currentIssues.length}</p>
				{
					currentIssues.map(i =>
					{
						return (
							<IssueCard issue={i} userMap={userMap} key={i.id} />
						);
					})
				}
			</div>
		);
	}

	return (
		<div className="board_container">

			{/* Header Container */}
			<div>

				{/* Breadcrumb */}
				<Breadcrumb project={project} lastPage="Kanban Board" />

				{/* Title Container */}
				<div style={{ display: "flex", justifyContent: "space-between" }}>

					{/* Title */}
					<span className="title">Kanban Board</span>

					{/* Github Link */}
					<GithubLink />

				</div>

			</div>

			{/* Search & Filter Container */}
			<div className="search_filter_container">

				{/* Search Input */}
				<input
					className="form_input search_input"
					placeholder="Search Issue Title"
					type="search"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				{/* Users */}
				<div>
					{
						projectDetails.users.map(u =>
						{
							return (
								<button
									key={u.id}
									title={u.name}
									className={`user_button ${selectedUsers.includes(u.id) ? "selected" : ""}`}
									onClick={() => toggleSelectedUser(u.id)}>
									<img src={u.avatarUrl} alt={u.name} height="32px" width="32px" />
								</button>
							);
						})
					}
				</div>

				{/* Only My Issues */}
				<Button
					palette={ButtonPalette.ghost}
					size={ButtonSize.small}
					className={"issue_filter_button" + `${onlyMyIssues ? " active" : ""}`}
					onClick={() => setOnlyMyIssues(!onlyMyIssues)}>
					Only My Issues
				</Button>

				{/* Recently Updated */}
				<Button
					palette={ButtonPalette.ghost}
					size={ButtonSize.small}
					className={"issue_filter_button" + `${recentlyUpdated ? " active" : ""}`}
					onClick={() => setRecentlyUpdated(!recentlyUpdated)}>
					Recently Updated
				</Button>

				{isAnyFilterApplied && <div className="vr"></div>}

				{/* Clear All */}
				{isAnyFilterApplied &&
					<Button
						palette={ButtonPalette.ghost}
						size={ButtonSize.small}
						onClick={() =>
						{
							setSearchTerm("");
							setSelectedUsers([]);
							setOnlyMyIssues(false);
							setRecentlyUpdated(false);
						}}>
						Clear All
					</Button>
				}

			</div>

			{/* Issues Board */}
			<div className="issues_board">
				{statusColumns}
			</div>

		</div>
	);
}