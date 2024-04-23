import "./CreateIssue.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";
import { Controller, useForm } from "react-hook-form";
import { Issue, IssuePriority, IssuePriorityLabel, IssueType, issueTypeOptions } from "../../models/issue.model";
import Select, { MultiValue, SingleValueProps, components } from "react-select";

import { DropdownOption } from "../../models/dropdownOption.model";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import { Spinner } from "../Spinner/Spinner";
import { User } from "../../models/user.model";
import _ from "lodash";
import { createIssue } from "../../services/Issue.service";
import { getIssueTypeIcon } from "../IssueCard/IssueCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const IssueTypeOption = (x: any) =>
{
	let { children, ...props } = x;
	console.log('IssueTypeOption x : ', x);
	return (
		<components.Option {...props} className="dropdown_option_with_image">
			{getIssueTypeIcon(props.data.value as IssueType)}
			{children}
		</components.Option>
	);
};

const IssueTypeSingleValue = ({ children, ...props }: SingleValueProps<DropdownOption>) =>
{
	console.log('SingleValue props : ', props);
	return (
		<components.SingleValue {...props} className="dropdown_option_with_image">
			{getIssueTypeIcon(props.data.value as IssueType)}
			{children}
		</components.SingleValue>
	);
};

// const IssueTypeControl = (x: ControlProps<DropdownOption, false>) =>
// {
// 	let { children, ...props } = x;
// 	console.log('IssueTypeComponent x : ', x);
// 	return (
// 		<components.Control {...props} className="dropdown_option_with_image">
// 			{getIssueTypeIcon(props?.selectProps?.name as IssueType)}
// 			{children}
// 		</components.Control>
// 	);
// };

export function CreateIssue(prop: { users: User[] })
{
	let [saving, setSaving] = useState(false);
	let [newIssue, setNewIssue] = useState<Partial<Issue>>({
		type: IssueType.task,
		title: '',
		description: '',
		reporterId: prop.users[0].id,
		userIds: [],
		priority: IssuePriority.medium,
	});

	// Route Navigation Hook
	let navigate = useNavigate();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Partial<Issue>>({
		defaultValues: newIssue,
	});

	let handleCloseModal = () =>
	{
		navigate('/board');
	};

	// Local Variables
	let reporterDropdownOptions: DropdownOption[] = prop.users.map((u) =>
	{
		return {
			value: u.id.toString(),
			label: u.name
		};
	});
	let assigneeOptions = _.cloneDeep(reporterDropdownOptions);
	let priorityOptions: DropdownOption[] = Object.entries(IssuePriorityLabel).map(([key, value]) =>
	{
		return { value: key, label: value };
	});

	// Function to handle form submission
	let onFormSubmit = async (newIssue: Partial<Issue>) =>
	{
		setSaving(true);
		console.log('Form submitted with data as : ', newIssue);
		try
		{
			let token = localStorage.getItem('token');
			await createIssue(token, newIssue);
			toast("Issue created successfully", {
				type: "success",
				theme: "colored",
			});
		}
		catch (error: any)
		{
			let errorMessage = error?.message || JSON.stringify(error, null, 4);
			alert('Error updating project\n' + errorMessage);
		}
		finally
		{
			setSaving(false);
		}
	}

	// Render the form
	return (
		<form className="create_issue_form" onSubmit={handleSubmit(onFormSubmit)}>
			<h2>Create Issue</h2>

			{/* Type */}
			<label>
				<p className="form_label">Issue Type</p>
				<Controller
					name="type"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Select
							{...field}
							{...register('type')}
							components={{ Option: IssueTypeOption, SingleValue: IssueTypeSingleValue }}
							hideSelectedOptions={true}
							className="basic-single"
							classNamePrefix="select"
							isSearchable={true}
							options={issueTypeOptions}
							value={issueTypeOptions.find((i) => i.value === newIssue.type)}
							onChange={(selected: any) =>
							{
								let selectedOption = selected as DropdownOption;
								field.onChange(selectedOption.value);
								setNewIssue({ ...newIssue, type: selectedOption?.value as IssueType })
							}}
						/>
					)}
				/>
				{errors.type && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* divider */}
			<div className="divider"></div>

			{/* Title */}
			<label>
				<p className="form_label">Short Summary</p>
				<input
					{...register("title", { required: true })}
					className="form_input"
					type="text"
					maxLength={100}
					value={newIssue.title}
					onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
				/>
				<p className="form_label helper">Concisely summarize the issue in one or two sentences.</p>
				{errors.title && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* Description */}
			<div>
				<p className="form_label">Description</p>
				<RichTextEditor
					value={newIssue.description}
					onChange={(value: string) => setNewIssue({ ...newIssue, description: value })}
					className="description_editor"
				/>
				<p className="form_label helper">Describe the issue in as much detail as you like</p>
			</div>

			{/* Reporter */}
			<label>
				<p className="form_label">Reporter</p>
				<Controller
					name="reporterId"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Select
							{...field}
							{...register('reporterId')}
							className="basic-single"
							classNamePrefix="select"
							isSearchable={true}
							options={reporterDropdownOptions}
							value={reporterDropdownOptions.find((u) => Number(u.value) === newIssue.reporterId)}
							onChange={(selectedOption: DropdownOption) =>
							{
								field.onChange(selectedOption.value);
								setNewIssue({ ...newIssue, reporterId: Number(selectedOption?.value) })
							}}
						/>
					)}
				/>
				{errors.type && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* Assignee */}
			<label>
				<p className="form_label">Assignee</p>
				<Controller
					name="userIds"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Select
							{...field}
							{...register('userIds')}
							className="basic-single"
							classNamePrefix="select"
							isSearchable={true}
							isMulti={true}
							options={assigneeOptions}
							value={assigneeOptions.filter((u) => newIssue.userIds.includes(Number(u.value)))}
							onChange={(selectedOptions: MultiValue<DropdownOption>) =>
							{
								let ids = selectedOptions.map(o => Number(o.value));
								field.onChange(ids);
								setNewIssue({ ...newIssue, userIds: ids });
							}}
						/>
					)}
				/>
				{errors.type && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* Priority */}
			<label>
				<p className="form_label">Priority</p>
				<Controller
					name="priority"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Select
							{...field}
							{...register('priority')}
							className="basic-single"
							classNamePrefix="select"
							isSearchable={true}
							options={priorityOptions}
							value={priorityOptions.find((p) => p.value === newIssue.priority)}
							onChange={(selectedOption: DropdownOption) =>
							{
								field.onChange(selectedOption.value);
								setNewIssue({ ...newIssue, priority: Number(selectedOption?.value) as unknown as IssuePriority })
							}}
						/>
					)}
				/>
				<p className="form_label helper">Priority in relation to other issues.</p>
				{errors.type && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* Buttons */}
			<div style={{ display: 'flex', gap: '1em', marginLeft: 'auto' }}>

				{/* Save Button */}
				<Button
					type="submit"
					disabled={saving}
					size={ButtonSize.small}
					className="save_button">
					<>
						{saving && <Spinner height={22} width={22} />}
						<span>Create Issue</span>
					</>
				</Button>

				{/* Cancel Button */}
				<Button
					type="button"
					filled={ButtonFilled.filled}
					palette={ButtonPalette.secondary}
					disabled={saving}
					size={ButtonSize.small}
					className="cancel_button"
					onClick={handleCloseModal}>
					Cancel
				</Button>

			</div>

		</form>
	);
}