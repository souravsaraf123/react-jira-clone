import "./Board.css";

import { Button, ButtonPalette, ButtonSize } from "../../shared/components/Button/Button";
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { Issue, IssueStatus, IssueStatusOrdering } from "../../shared/models/issue.model";

import { Breadcrumb } from "../../shared/components/Breadcrumb/Breadcrumb";
import { GithubLink } from "../../shared/components/GithubLink/GithubLink";
import { IssueCard } from "../../shared/components/IssueCard/IssueCard";
import { ProjectWithDetailsContext } from "../../App";
import { User } from "../../shared/models/user.model";
import _ from "lodash";
import { updateIssues } from "../../shared/services/Issue.service";
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
	let issuesGroupedByStatus = groupIssuesByStatus(filteredIssues);
	let isAnyFilterApplied = searchTerm || selectedUsers.length > 0 || onlyMyIssues || recentlyUpdated;

	function groupIssuesByStatus(issues: Issue[])
	{
		let issuesGroupedByStatus = _.groupBy(issues, (i) => i.status) as Record<IssueStatus, Issue[]>;

		for (let i = 1; i <= Object.values(IssueStatus).length; i++)
		{
			let status = IssueStatusOrdering[i];
			if (!issuesGroupedByStatus[status])
			{
				issuesGroupedByStatus[status] = [];
			}
			else
			{
				issuesGroupedByStatus[status] = _.orderBy(issuesGroupedByStatus[status], (i) => i.listPosition, 'asc');
			}
		}

		return issuesGroupedByStatus;
	}

	async function handleDragEnd(result: DropResult)
	{
		// TODO: implement later
		console.log(result);

		// If the user cancels the drag
		if (result.reason === "CANCEL")
		{
			return;
		}

		// If the user drops the draggable outside of a droppable
		if (!result.destination)
		{
			return;
		}

		// If the user drops the draggable back to its original position
		if (result.source.droppableId === result.destination.droppableId &&
			result.source.index === result.destination.index
		)
		{
			return;
		}

		let payloadForApi: Partial<Issue>[] = [];
		let sourceStatus = result.source.droppableId as IssueStatus;
		let destinationStatus = result.destination.droppableId as IssueStatus;
		let clonedIssues = structuredClone(issues);
		let issuesGroupedByStatus = groupIssuesByStatus(clonedIssues);
		let draggedIssue = issuesGroupedByStatus[sourceStatus][result.source.index];
		console.log('Grouped Issues Initially : ', structuredClone(issuesGroupedByStatus));

		// Delete the issue from the source column , update list positions of all items below the dragged item
		issuesGroupedByStatus[sourceStatus].splice(result.source.index, 1);

		draggedIssue.status = destinationStatus;
		issuesGroupedByStatus[destinationStatus].splice(result.destination.index, 0, draggedIssue);

		// New UI State
		let pos = 0;
		let newIssues: Issue[] = _.orderBy(Object.values(issuesGroupedByStatus).flat(), i => i.id);
		for (let i = 1; i < Object.values(IssueStatus).length; i++)
		{
			let status = IssueStatusOrdering[i];
			for (let issue of issuesGroupedByStatus[status])
			{
				pos++;
				issue.listPosition = pos;
			}
		}

		console.log('Grouped Issues Finally : ', issuesGroupedByStatus);

		// Prepare payload for API
		let oldIssuesCopy = _.orderBy(structuredClone(issues), i => i.id);
		for (let i = 0; i < newIssues.length; i++)
		{
			let newIssue = newIssues[i];
			let oldIssue = oldIssuesCopy[i];

			let delta: Partial<Issue> = {};

			// If the issue has changed its position
			if (newIssue.listPosition !== oldIssue.listPosition)
			{
				delta.listPosition = newIssue.listPosition;
			}

			// If the issue has changed its status
			if (newIssue.status !== oldIssue.status)
			{
				delta.status = newIssue.status;
			}

			// If there are any changes, add the issue to the payload
			if (Object.keys(delta).length > 0)
			{
				payloadForApi.push({ id: newIssue.id, ...delta });
			}
		}
		setIssues(newIssues); // optimistic update

		try
		{
			console.log('Payload for API : ', payloadForApi);
			let token = localStorage.getItem("token");
			await updateIssues(token, payloadForApi);
		}
		catch (error)
		{
			console.error(error);
			alert("Failed to update issues. Please try again later.");
			setIssues(issues);
		}
	}

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
		statusColumns.push(
			<Droppable droppableId={status} key={status}>
				{(provided) => (
					<div
						className="status_container"
						{...provided.droppableProps}
						ref={provided.innerRef}>
						<p className="status_title">{statusTextMap[status]} {currentIssues.length}</p>
						{
							_.orderBy(currentIssues, (i) => i.listPosition, 'asc').map((iss, index) =>
							{
								return (
									<IssueCard index={index} issue={iss} userMap={userMap} key={iss.id} />
								);
							})
						}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		);
	}

	return (

		<DragDropContext onDragEnd={handleDragEnd}>
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
		</DragDropContext>
	);
}