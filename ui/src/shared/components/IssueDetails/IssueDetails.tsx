import "./IssueDetails.css";

import { Issue, IssuePriorityLabel, IssueType, IssueWithUsersAndComments, issueTypeOptions } from "../../models/issue.model";
import { IssueTypeOption, IssueTypeSingleValue } from "../CreateIssue/CreateIssue";
import { getIssue, updateIssue } from "../../services/Issue.service";
import { useEffect, useState } from "react";

import { DropdownOption } from "../../models/dropdownOption.model";
import Select from "react-select";
import { Spinner } from "../Spinner/Spinner";
import { User } from "../../models/user.model";
import _ from "lodash";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export function IssueDetails(prop: { users: User[], issues: Issue[], setIssues: React.Dispatch<React.SetStateAction<Issue[]>> })
{
	// initialize the component by calling the api route get issue id
	useEffect(() =>
	{
		console.log('Issue Details UseEffect called');
		// since useEffect can't be async, we define an async function inside it
		let init = async () =>
		{
			try
			{
				// Call Api
				console.log('Getting issue details by id : ', issueId);
				let token = localStorage.getItem("token");
				let issueDetailsResponse = await getIssue(token, Number(issueId));
				setIssueDetails(issueDetailsResponse);
				console.log('Got issue details by id : ', issueId, issueDetailsResponse);
			}
			catch (error: any)
			{
				console.error('Error while getting issue details : ', error);
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
	console.log('Issue Id : ', issueId);

	// State
	let [issueDetails, setIssueDetails] = useState<IssueWithUsersAndComments | null>(null);
	let [isLoading, setIsLoading] = useState<boolean>(true);
	let [error, setError] = useState<any>(null);

	async function updateIssueDetails(updatedIssueRequest: Partial<IssueWithUsersAndComments>)
	{
		console.log('Issue details before update call : ', issueDetails);
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			let updatedIssueResponse = await updateIssue(token, issueDetails.id, updatedIssueRequest);
			console.log('Updated issue response : ', updatedIssueResponse);
			let updatedIssueDetailsWithComments = {
				...issueDetails,
				...updatedIssueRequest,
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

	console.log('issueTypeOptions : ', issueTypeOptions);
	console.log('loading : ', isLoading);
	console.log('error : ', error);

	let successState = issueDetails && (
		<div className="issue_details_container">
			<div className="issue_header">
				<Select
					components={{ Option: IssueTypeOption, SingleValue: IssueTypeSingleValue }}
					hideSelectedOptions={true}
					className="basic-single"
					classNamePrefix="select"
					isSearchable={true}
					options={issueTypeOptions}
					value={issueTypeOptions.find((i) => i.value == issueDetails.type)}
					onChange={(selected: any) =>
					{
						let selectedOption = selected as DropdownOption;
						let requestBody: Partial<IssueWithUsersAndComments> = {
							type: selectedOption?.value as IssueType,
						};
						updateIssueDetails(requestBody);
					}}
					inputValue={""}
					onInputChange={() => { }}
					onMenuOpen={() => { }}
					onMenuClose={() => { }}
				/>
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