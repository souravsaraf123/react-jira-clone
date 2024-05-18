import "./IssueDetails.css";
// This import is necessary for module augmentation.
// It allows us to extend the 'Props' interface in the 'react-select/base' module
// and add our custom property 'myCustomProp' to it.
import type { } from 'react-select/base';

import { Issue, IssuePriorityLabel, IssueWithUsersAndComments } from "../../models/issue.model";
import { deleteIssue, getIssue, updateIssue } from "../../services/Issue.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DropdownOption } from "../../models/dropdownOption.model";
import { IssueDetailsHeader } from "../IssueDetailsHeader/IssueDetailsHeader";
import { Spinner } from "../Spinner/Spinner";
import { User } from "../../models/user.model";
import _ from "lodash";
import { toast } from "react-toastify";

export function IssueDetails(prop: { users: User[], issues: Issue[], setIssues: React.Dispatch<React.SetStateAction<Issue[]>> })
{
	// initialize the component by calling the api route get issue id
	useEffect(() =>
	{
		// since useEffect can't be async, we define an async function inside it
		let init = async () =>
		{
			try
			{
				// Call Api
				let token = localStorage.getItem("token");
				let issueDetailsResponse = await getIssue(token, Number(issueId));
				setIssueDetails(issueDetailsResponse);
			}
			catch (error: any)
			{
				let errorMsg = error?.message || JSON.stringify(error, null, 4);
				toast(errorMsg, {
					type: "error",
					theme: "colored",
				});
				setError(error);
			}
			finally
			{
				setIsLoading(false);
			}
		};

		// call the async function
		init();

	}, []);

	// Get the userId param from the URL.
	let { issueId } = useParams();
	let navigate = useNavigate();

	// State
	let [issueDetails, setIssueDetails] = useState<IssueWithUsersAndComments | null>(null);
	let [isLoading, setIsLoading] = useState<boolean>(true);
	let [error, setError] = useState<any>(null);

	const updateIssueDetails = async (updatedIssueRequest: Partial<IssueWithUsersAndComments>) =>
	{
		console.log('Issue details before update call : ', issueDetails);
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			let updatedIssueResponse: Issue = await updateIssue(token, issueDetails.id, updatedIssueRequest);
			let updatedIssueDetailsWithComments: IssueWithUsersAndComments = {
				...issueDetails,
				...updatedIssueRequest,
				updatedAt: updatedIssueResponse.updatedAt,
			};

			// Update State for Issue Details
			setIssueDetails(updatedIssueDetailsWithComments);

			// Update State for Board
			let updatedIssueWithoutComments = _.cloneDeep(updatedIssueDetailsWithComments);
			delete updatedIssueWithoutComments.comments;
			delete updatedIssueWithoutComments.users;
			let updatedIssues = prop.issues.map((iss) => iss.id === updatedIssueRequest.id ? updatedIssueWithoutComments : iss);
			prop.setIssues(updatedIssues);
		}
		catch (error: any)
		{
			// toast
			console.error('Error while updating issue details : ', error);
			let errorMsg = error?.message || JSON.stringify(error, null, 4);
			let toastMsg = ['Failed to update issue', errorMsg].filter(Boolean).join('\n');
			toast(toastMsg, {
				type: "error",
				theme: "colored",
				data: 'Please check your network connection and try again.'
			});
		}
	}

	const deleteIssueById = async () =>
	{
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			await deleteIssue(token, issueDetails.id);

			// toast
			toast('Issue deleted successfully', {
				type: "success",
				theme: "colored",
			});

			// Update State for Board
			let updatedIssues = prop.issues.filter((iss) => iss.id !== issueDetails.id);
			prop.setIssues(updatedIssues);

			// Navigate to board
			navigate('/board');
		}
		catch (error: any)
		{
			// toast
			console.error('Error while deleting issue : ', error);
			let errorMsg = error?.message || JSON.stringify(error, null, 4);
			let toastMsg = ['Failed to delete issue', errorMsg].filter(Boolean).join('\n');
			toast(toastMsg, {
				type: "error",
				theme: "colored",
			});
		}
	}

	let handleCloseModal = () =>
	{
		navigate('/board');
	};

	// Local Variables
	let reporterDropdownOptions: DropdownOption[] = prop.users.map((u) =>
	{
		return {
			value: u.id.toString(),
			label: u.name,
			imageUrl: u.avatarUrl,
		};
	});
	let assigneeOptions = _.cloneDeep(reporterDropdownOptions);
	let priorityOptions: DropdownOption[] = Object.entries(IssuePriorityLabel).map(([key, value]) =>
	{
		return { value: key, label: value };
	});

	// JSX
	let loadingState = (
		<div className="center_of_body">
			<Spinner height={70} width={70} variation="dark" />
		</div>
	);

	let errorState = (
		<div className="center_of_body">
			<h1>Error</h1>
			<br />
			<p>{error?.message || JSON.stringify(error, null, 4)}</p>
		</div>
	);

	let successState = issueDetails && (
		<div className="issue_details_container">
			<div className="issue_header">

				<IssueDetailsHeader
					issueDetails={issueDetails}
					updateIssueDetails={updateIssueDetails}
					deleteIssueById={deleteIssueById}
					handleCloseModal={handleCloseModal}>
				</IssueDetailsHeader>

			</div>
			<div className="issue_details">
				<h1>{issueDetails.title}</h1>
			</div>
		</div>
	);

	let finalState = isLoading ? loadingState : error ? errorState : successState;
	return (
		<>
			{finalState}
		</>
	);
};