import "./IssueDetailsHeader.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";
import { GroupBase, SingleValueProps, components } from "react-select";
import { IssueType, IssueWithUsersAndComments, issueTypeOptions } from "../../models/issue.model";

import { About } from "../Sidebar/About/About";
import ConfirmDelete from "../ConfirmDeleteIssue/ConfirmDeleteIssue";
import { DropdownOption } from "../../models/dropdownOption.model";
import { IssueTypeOption } from "../CreateIssue/CreateIssue";
import { Popover } from "react-tiny-popover";
import ReactModal from "react-modal";
import SVG from 'react-inlinesvg';
import Select from "react-select";
import { getIssueTypeIcon } from "../IssueCard/IssueCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
		</components.SingleValue>
	);
};

export interface IssueDetailsHeaderProps
{
	issueDetails: IssueWithUsersAndComments;
	updateIssueDetails: (requestBody: Partial<IssueWithUsersAndComments>) => void;
	deleteIssueById: () => void;
	handleCloseModal: () => void;
}
export function IssueDetailsHeader(props: IssueDetailsHeaderProps)
{
	// state
	let [copyLinkText, setCopyLinkText] = useState<string>('Copy Link');
	let [issueDeleteModalIsOpen, setIssueDeleteModalIsOpen] = useState<boolean>(false);
	let [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
	let navigate = useNavigate();

	// local variables
	let { issueDetails, updateIssueDetails, deleteIssueById, handleCloseModal } = props;

	function copyLink()
	{
		navigator.clipboard.writeText(window.location.href);
		setCopyLinkText('Link copied');
		setTimeout(() =>
		{
			setCopyLinkText('Copy Link');
		}, 2000);
	}

	return (
		<>
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
				<ConfirmDelete
					questionToAsk={`Are you sure you want to delete issue ${issueDetails.id} ?`}
					setIssueDeleteModalIsOpen={setIssueDeleteModalIsOpen}
					deleteIssueFunction={deleteIssueById}>
				</ConfirmDelete>
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
		</>
	);
}