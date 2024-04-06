import "./ProjectSettings.css";

import { Button, ButtonSize } from "../../shared/components/Button/Button";
import { Controller, useForm } from 'react-hook-form';
import { Project, ProjectCategory } from "../../shared/models/project.model";

import { Breadcrumb } from "../../shared/components/Breadcrumb/Breadcrumb";
import { DropdownOption } from "../../shared/models/dropdownOption.model";
import { ProjectWithDetailsContext } from "../../App";
import { RichTextEditor } from "../../shared/components/RichTextEditor/RichTextEditor";
import Select from "react-select";
import { Spinner } from "../../shared/components/Spinner/Spinner";
import { toast } from "react-toastify";
import { updateProject } from "../../shared/services/Project.service";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function ProjectSettings()
{
	let { project, setProject } = useOutletContext<ProjectWithDetailsContext>();
	let [projectClone, setProjectClone] = useState(structuredClone(project));
	let [saving, setSaving] = useState(false);
	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Partial<Project>>({ defaultValues: projectClone });

	// Convert the ProjectCategory enum to an array of objects for the Select component
	let categoryOptions: DropdownOption[] = Object.values(ProjectCategory).map((c) =>
	{
		return { value: c, label: c.charAt(0).toUpperCase() + c.slice(1) };
	});
	let selectedCategory = categoryOptions.find((c) => c.value === projectClone.category);
	console.log('Selected category : ', selectedCategory);

	let onFormSubmit = async (p: Partial<Project>) =>
	{
		setSaving(true);
		console.log('Form submitted with data as : ', p);
		try
		{
			let token = localStorage.getItem('token');
			await updateProject(token, projectClone);
			setProject(projectClone);
			toast("Project updated successfully", {
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

	return (
		<form className="project_settings_form" onSubmit={handleSubmit(onFormSubmit)}>

			{/* Breadcrumb */}
			<Breadcrumb project={project} lastPage="Project Details" />

			{/* Form Title */}
			<p className="title">Project Details</p>

			{/* Name */}
			<label>
				<p className="form_label">Name</p>
				<input {...register("name", { required: true })} className="form_input" type="text" value={projectClone.name} onChange={(e) => setProjectClone({ ...projectClone, name: e.target.value })} />
				{errors.name && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* URL */}
			<label>
				<p className="form_label">URL</p>
				<input {...register("url")} className="form_input" type="text" value={projectClone.url} onChange={(e) => setProjectClone({ ...projectClone, url: e.target.value })} />
			</label>

			{/* Description */}
			<label>
				<p className="form_label">Description</p>
				{/* <textarea {...register("description")} className="form_input" value={projectClone.description} onChange={(e) => setProjectClone({ ...projectClone, description: e.target.value })} /> */}
			</label>

			<RichTextEditor
				value={projectClone.description}
				onChange={(value) => setProjectClone({ ...projectClone, description: value })}
				className="project_description_editor"
			/>
			<p className="form_label helper">Describe the project in as much detail as you like</p>

			{/* Category */}
			<label>
				<p className="form_label">Category</p>
				<Controller
					name="category"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Select
							{...field}
							{...register('category')}
							className="basic-single"
							classNamePrefix="select"
							// isClearable={true}
							isSearchable={true}
							options={categoryOptions}
							value={selectedCategory}
							onChange={(selectedOption: DropdownOption) =>
							{
								console.log('Selected category : ', selectedOption);
								field.onChange(selectedOption.value);
								setProjectClone({ ...projectClone, category: selectedOption?.value as ProjectCategory })
							}}
						/>
					)}
				/>
				{errors.category && <span className="form_error_msg">This field is required</span>}
			</label>

			{/* Submit Button */}
			<Button
				type="submit"
				disabled={saving}
				size={ButtonSize.small}
				className="project_settings_save_button">
				<>
					{saving && <Spinner height={22} width={22} />}
					<span>Save changes</span>
				</>
			</Button>

		</form>
	);
};