import { Button, ButtonFilled, ButtonPalette, ButtonSize } from '../Button/Button';

interface ConfirmDeleteIssueProps
{
	issueId: number;
	setIssueDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	deleteIssueFunction: () => void;
}

export function ConfirmDeleteIssue(props: ConfirmDeleteIssueProps)
{
	const handleDelete = () =>
	{
		props.deleteIssueFunction();
	};

	return (
		<div style={{ display: 'grid', gap: '1.5em' }}>
			<p className="title">Are you sure you want to delete issue {props.issueId} ?</p>
			<p>Once you delete, it's gone for good.</p>

			<div style={{ display: 'flex', gap: '1em', 'justifyContent': 'flex-end' }}>
				{/* Delete Button */}
				<Button
					palette={ButtonPalette.danger}
					filled={ButtonFilled.filled}
					size={ButtonSize.small}
					onClick={handleDelete}>
					Delete issue
				</Button>

				{/* Cancel Button */}
				<Button
					type="button"
					filled={ButtonFilled.filled}
					palette={ButtonPalette.secondary}
					size={ButtonSize.small}
					onClick={() => props.setIssueDeleteModalIsOpen(false)}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default ConfirmDeleteIssue;