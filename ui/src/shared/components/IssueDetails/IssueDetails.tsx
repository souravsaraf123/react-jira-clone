import "./IssueDetails.css";
// This import is necessary for module augmentation.
// It allows us to extend the 'Props' interface in the 'react-select/base' module
// and add our custom property 'myCustomProp' to it.
import type { } from 'react-select/base';

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";
import { Issue, IssuePriorityLabel, IssueType, IssueWithUsersAndComments, issueTypeOptions } from "../../models/issue.model";
import Select, { GroupBase, SingleValueProps, components } from "react-select";
import { deleteIssue, getIssue, updateIssue } from "../../services/Issue.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { About } from "../Sidebar/About/About";
import ConfirmDeleteIssue from "../ConfirmDeleteIssue/ConfirmDeleteIssue";
import { DropdownOption } from "../../models/dropdownOption.model";
import { IssueTypeOption } from "../CreateIssue/CreateIssue";
import { Popover } from "react-tiny-popover";
import ReactModal from "react-modal";
import SVG from 'react-inlinesvg';
import { Spinner } from "../Spinner/Spinner";
import { User } from "../../models/user.model";
import _ from "lodash";
import { getIssueTypeIcon } from "../IssueCard/IssueCard";
import { toast } from "react-toastify";

declare module 'react-select/base' {
	export interface Props<
		Option,
		IsMulti extends boolean,
		Group extends GroupBase<Option>
	>
	{
		issueId?: number;
	}
}

export const IssueTypeWithIdSingleValue = ({ children, ...props }: SingleValueProps<DropdownOption>) =>
{
	return (
		<components.SingleValue {...props} className="dropdown_option_with_image">
			{getIssueTypeIcon(props.data.value as IssueType)}
			{`${props.data.value.toUpperCase()}-${props.selectProps.issueId}`}
			{/* {children} */}
			{/* <span style={{ marginLeft: '4px' }}>{props.selectProps.issueId}</span> */}
		</components.SingleValue>
	);
};

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
	let [copyLinkText, setCopyLinkText] = useState<string>('Copy Link');
	let [issueDeleteModalIsOpen, setIssueDeleteModalIsOpen] = useState<boolean>(false);
	let [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

	async function updateIssueDetails(updatedIssueRequest: Partial<IssueWithUsersAndComments>)
	{
		console.log('Issue details before update call : ', issueDetails);
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			let updatedIssueResponse = await updateIssue(token, issueDetails.id, updatedIssueRequest);
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

	const deleteIssueById = async () =>
	{
		try
		{
			// Call Api
			let token = localStorage.getItem("token");
			let deleteIssueResponse = await deleteIssue(token, issueDetails.id);

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

	function copyLink()
	{
		navigator.clipboard.writeText(window.location.href);
		setCopyLinkText('Link copied');
		setTimeout(() =>
		{
			setCopyLinkText('Copy Link');
		}, 2000);
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

				{/* Issue Type */}
				<Select
					issueId={issueDetails.id}
					components={{
						Option: IssueTypeOption,
						SingleValue: IssueTypeWithIdSingleValue,
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
					}}
					hideSelectedOptions={true}
					className="issue_type_select"
					classNamePrefix="select"
					isSearchable={false}
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

				{/* Give feedback */}
				<Popover
					isOpen={isPopoverOpen}
					onClickOutside={() => setIsPopoverOpen(false)}
					positions={['bottom']}
					align="center"
					padding={10}
					content={<About />}>
					<Button
						type="button"
						filled={ButtonFilled.filled}
						palette={ButtonPalette.ghost}
						size={ButtonSize.small}
						onClick={() => setIsPopoverOpen(!isPopoverOpen)}
						style={{ color: 'var(--textDark)', marginLeft: 'auto', }}>
						<SVG src={"/src/assets/images/send.svg"} height={20} width={20} />
						Give feedback
					</Button>
				</Popover>

				{/* Copy link */}
				<Button
					type="button"
					filled={ButtonFilled.filled}
					palette={ButtonPalette.ghost}
					size={ButtonSize.small}
					style={{ color: 'var(--textDark)' }}
					onClick={copyLink}>
					<SVG src={"/src/assets/images/link.svg"} height={20} width={20} />
					{copyLinkText}
				</Button>

				{/* Delete Issue */}
				<Button
					type="button"
					filled={ButtonFilled.filled}
					palette={ButtonPalette.ghost}
					size={ButtonSize.small}
					onClick={() => setIssueDeleteModalIsOpen(true)}>
					<SVG src={"/src/assets/images/delete.svg"} height={20} width={20} />
				</Button>
				{/* Confirm Delete Modal */}
				<ReactModal
					isOpen={issueDeleteModalIsOpen}
					appElement={document.getElementById("root") as HTMLElement}
					shouldCloseOnEsc={true}
					onRequestClose={() => navigate("/board")}
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
					<ConfirmDeleteIssue
						issueId={issueDetails.id}
						setIssueDeleteModalIsOpen={setIssueDeleteModalIsOpen}
						deleteIssueFunction={deleteIssueById}>
					</ConfirmDeleteIssue>

				</ReactModal>

				{/* Close Modal */}
				<Button
					type="button"
					filled={ButtonFilled.filled}
					palette={ButtonPalette.ghost}
					size={ButtonSize.small}
					onClick={handleCloseModal}>
					<SVG src={"/src/assets/images/close.svg"} height={24} width={24} />
				</Button>
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