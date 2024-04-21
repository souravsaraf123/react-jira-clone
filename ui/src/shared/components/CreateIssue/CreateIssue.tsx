import "./CreateIssue.css";

import { Button, ButtonFilled, ButtonPalette, ButtonSize } from "../Button/Button";
import { Controller, useForm } from "react-hook-form";
import { Issue, IssueType, issueTypeOptions } from "../../models/issue.model";
import Select, { MultiValue } from "react-select";

import { DropdownOption } from "../../models/dropdownOption.model";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import { Spinner } from "../Spinner/Spinner";
import { User } from "../../models/user.model";
import _ from "lodash";
import { createIssue } from "../../services/Issue.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CreateIssue(prop: { users: User[] })
{
	let [saving, setSaving] = useState(false);
	let [newIssue, setNewIssue] = useState<Partial<Issue>>({});

	// Route Navigation Hook
	let navigate = useNavigate();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Partial<Issue>>();

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
							className="basic-single"
							classNamePrefix="select"
							isSearchable={true}
							options={issueTypeOptions}
							value={issueTypeOptions.find((i) => i.value === newIssue.type)}
							onChange={(selectedOption: DropdownOption) =>
							{
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
							value={assigneeOptions.find((u) => Number(u.value) === newIssue.reporterId)}
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