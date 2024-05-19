import "./IssueDetailsRhs.css";

import { AssigneeMultiValue, IssuePriorityOption, IssuePrioritySingleValue, ReporterOption, ReporterSingleValue } from "../CreateIssue/CreateIssue";
import { IssuePriority, IssuePriorityLabel, IssueStatus, IssueWithUsersAndComments } from "../../models/issue.model";
import Select, { MultiValue, SingleValueProps, components } from "react-select";

import { DropdownOption } from "../../models/dropdownOption.model";
import { User } from "../../models/user.model";
import _ from "lodash";
import moment from "moment";
import { useState } from "react";

let dropdownMenuFullWidthStyle = {
	menu: (styles: any) => ({ ...styles, width: '280px' }),
};

export const statusOptions = [
	{
		value: IssueStatus.backlog,
		label: 'BACKLOG',
		bgColor: 'var(--backgroundMedium)',
		color: 'var(--textDark)',
	},
	{
		value: IssueStatus.selected,
		label: 'SELECTED FOR DEVELOPMENT',
		bgColor: 'var(--warning)',
		color: 'white',
	},
	{
		value: IssueStatus.inprogress,
		label: 'IN PROGRESS',
		bgColor: 'var(--primary)',
		color: 'white',
	},
	{
		value: IssueStatus.done,
		label: 'DONE',
		bgColor: 'var(--success)',
		color: 'white',
	},
];

export type StatusOption = typeof statusOptions[number];

function getPillStyle(option: StatusOption)
{
	return {
		backgroundColor: option.bgColor,
		color: option.color,
	};
}

export const StatusOption = (x: any) =>
{
	let { children, ...props } = x;
	return (
		<components.Option {...props}>
			<span className="status_pill" style={getPillStyle(props.data)}>{children}</span>
		</components.Option>
	);
};

export const StatusSingleValue = ({ children, ...props }: SingleValueProps<DropdownOption>) =>
{
	return (
		<components.SingleValue {...props}>
			<div className="status_pill" style={getPillStyle(props.data as StatusOption)}>{children}</div>
		</components.SingleValue>
	);
};

export interface IssueDetailsRhsProps
{
	users: User[];
	issueDetails: IssueWithUsersAndComments;
	updateIssueDetails: (requestBody: Partial<IssueWithUsersAndComments>) => Promise<boolean>;
}

export function IssueDetailsRhs(prop: IssueDetailsRhsProps)
{
	// state
	let [estimate, setEstimate] = useState(prop.issueDetails.estimate || 0);

	// Local Variables
	let reporterOptions: DropdownOption[] = prop.users.map((u) =>
	{
		return {
			value: u.id.toString(),
			label: u.name,
			imageUrl: u.avatarUrl,
		};
	});
	let assigneeOptions = _.cloneDeep(reporterOptions);
	let priorityOptions: DropdownOption[] = Object.entries(IssuePriorityLabel).map(([key, value]) =>
	{
		return { value: key, label: value };
	});
	let createdAt = `Created at ${moment(prop.issueDetails.createdAt).fromNow()}`;
	let updatedAt = `Updated at ${moment(prop.issueDetails.updatedAt).fromNow()}`;

	return (
		<div className="rhs_container">

			{/* statusOptions */}
			<div className="field_container">
				<p className="rhs_field_label">Status</p>
				<Select
					components={{
						Option: StatusOption,
						SingleValue: StatusSingleValue,
						// DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
					}}
					styles={dropdownMenuFullWidthStyle}
					hideSelectedOptions={true}
					isSearchable={false}
					className="issue_type_select rhs_select"
					classNamePrefix="select"
					options={statusOptions}
					value={statusOptions.find((i) => i.value == prop.issueDetails.status)}
					onChange={(selected: any) =>
					{
						let selectedOption = selected as DropdownOption;
						let requestBody: Partial<IssueWithUsersAndComments> = {
							status: selectedOption?.value as IssueStatus,
						};
						prop.updateIssueDetails(requestBody);
					}}
					inputValue={""}
					onInputChange={() => { }}
					onMenuOpen={() => { }}
					onMenuClose={() => { }}
				/>
			</div>

			{/* Assignee */}
			<div className="field_container">

				<p className="rhs_field_label">Assignee</p>
				<Select
					components={{
						Option: ReporterOption,
						MultiValueLabel: AssigneeMultiValue,
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
					}}
					styles={{ ...dropdownMenuFullWidthStyle, }}
					hideSelectedOptions={true}
					isSearchable={false}
					isMulti={true}
					className="issue_type_select rhs_select w100"
					classNamePrefix="select"
					options={assigneeOptions}
					value={assigneeOptions.find((i) => prop.issueDetails.userIds.includes(Number(i)))}
					onChange={(selectedOptions: MultiValue<DropdownOption>) =>
					{
						let ids = selectedOptions.map(o => Number(o.value));
						let requestBody: Partial<IssueWithUsersAndComments> = {
							userIds: ids,
						};
						prop.updateIssueDetails(requestBody);
					}}
					inputValue={""}
					onInputChange={() => { }}
					onMenuOpen={() => { }}
					onMenuClose={() => { }}
				/>

			</div>

			{/* Reporter */}
			<div className="field_container">
				<p className="rhs_field_label">Reporter</p>
				<Select
					components={{
						Option: ReporterOption,
						SingleValue: ReporterSingleValue,
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
					}}
					styles={dropdownMenuFullWidthStyle}
					hideSelectedOptions={true}
					isSearchable={false}
					className="issue_type_select rhs_select"
					classNamePrefix="select"
					options={reporterOptions}
					value={reporterOptions.find((i) => i.value == prop.issueDetails.reporterId.toString())}
					onChange={(selected: any) =>
					{
						let selectedOption = selected as DropdownOption;
						let requestBody: Partial<IssueWithUsersAndComments> = {
							reporterId: Number(selectedOption?.value),
						};
						prop.updateIssueDetails(requestBody);
					}}
					inputValue={""}
					onInputChange={() => { }}
					onMenuOpen={() => { }}
					onMenuClose={() => { }}
				/>
			</div>

			{/* Priority */}
			<div className="field_container">
				<p className="rhs_field_label">Priority</p>
				<Select
					components={{
						Option: IssuePriorityOption,
						SingleValue: IssuePrioritySingleValue,
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
					}}
					styles={dropdownMenuFullWidthStyle}
					hideSelectedOptions={true}
					isSearchable={false}
					className="issue_type_select rhs_select"
					classNamePrefix="select"
					options={priorityOptions}
					value={priorityOptions.find((i) => i.value == prop.issueDetails.reporterId.toString())}
					onChange={(selected: any) =>
					{
						let selectedOption = selected as DropdownOption;
						let requestBody: Partial<IssueWithUsersAndComments> = {
							priority: selectedOption?.value as IssuePriority,
						};
						prop.updateIssueDetails(requestBody);
					}}
					inputValue={""}
					onInputChange={() => { }}
					onMenuOpen={() => { }}
					onMenuClose={() => { }}
				/>
			</div>

			{/* Estimate */}
			<div className="field_container">
				<p className="rhs_field_label">ORIGINAL ESTIMATE (HOURS)</p>
				<input
					className="form_input"
					type="text"
					value={estimate}
					onChange={(e) => setEstimate(Number(e.target.value) || 0)}
					onBlur={async (e) =>
					{
						let requestBody: Partial<IssueWithUsersAndComments> = {
							estimate: Number(e.target.value) || 0,
						};
						let isSuccessful = await prop.updateIssueDetails(requestBody);
						if (!isSuccessful)
						{
							setEstimate(prop.issueDetails.estimate);
						}
					}}
				/>
			</div>

			{/* Divider */}
			<div className="divider"></div>

			{/* Audit fields */}
			<div className="audit_fields">
				<p title={prop.issueDetails.createdAt}>{createdAt}</p>
				<p title={prop.issueDetails.updatedAt}>{updatedAt}</p>
			</div>

		</div>
	);
}