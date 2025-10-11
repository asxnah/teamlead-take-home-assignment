import React, { useState } from 'react';
import type { Task, User } from '../types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Select,
	MenuItem,
} from '@mui/material';

interface Props {
	task: Task;
	team: User[];
	onClose: () => void;
	onFix: (taskId: string, patch: Partial<Task>) => void;
}

const FixDialog: React.FC<Props> = ({ task, team, onClose, onFix }) => {
	const [assigneeId, setAssigneeId] = useState<string>(task.assigneeId || '');
	const [priority, setPriority] = useState<string>(task.priority);

	const handleSubmit = () => {
		const patch: Partial<Task> = !task.assigneeId
			? { assigneeId }
			: { priority: priority as Task['priority'] };
		onFix(task.id, patch);
		onClose();
	};

	const isNoAssignee = !task.assigneeId;

	return (
		<Dialog open onClose={onClose}>
			<DialogTitle>Fix Task</DialogTitle>
			<DialogContent>
				{isNoAssignee ? (
					<Select
						value={assigneeId}
						onChange={(e) => setAssigneeId(e.target.value)}
						fullWidth
					>
						{team
							.filter((u) => u.active)
							.map((u) => (
								<MenuItem key={u.id} value={u.id}>
									{u.name}
								</MenuItem>
							))}
					</Select>
				) : (
					<Select
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
						fullWidth
					>
						<MenuItem value="Medium">Medium</MenuItem>
						<MenuItem value="High">High</MenuItem>
					</Select>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant="contained">
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default FixDialog;
