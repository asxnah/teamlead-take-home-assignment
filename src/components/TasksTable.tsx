import React, { useState } from 'react';
import type { Task, User } from '../types';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Chip,
} from '@mui/material';
import FixDialog from './FixDialog';

interface Props {
	tasks: Task[];
	team: User[];
	onFix: (taskId: string, patch: Partial<Task>) => void;
}

const TasksTable: React.FC<Props> = ({ tasks, team, onFix }) => {
	const [selected, setSelected] = useState<Task | null>(null);

	const getAssignee = (id: string | null) =>
		team.find((u) => u.id === id)?.name || '—';
	const isProblem = (t: Task) =>
		!t.assigneeId ||
		(t.priority === 'Low' &&
			new Date(t.dueDate) < new Date(Date.now() + 3 * 86400000));

	return (
		<>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Key</TableCell>
						<TableCell>Summary</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Assignee</TableCell>
						<TableCell>Priority</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tasks.map((t) => (
						<TableRow
							key={t.id}
							sx={{
								bgcolor: !t.assigneeId
									? '#ffe6e6'
									: isProblem(t)
									? '#fff8e1'
									: 'inherit',
							}}
						>
							<TableCell>{t.key}</TableCell>
							<TableCell>{t.summary}</TableCell>
							<TableCell>{t.status}</TableCell>
							<TableCell>{getAssignee(t.assigneeId)}</TableCell>
							<TableCell>
								<Chip
									label={t.priority}
									color={
										t.priority === 'High'
											? 'error'
											: t.priority === 'Medium'
											? 'warning'
											: 'default'
									}
								/>
							</TableCell>
							<TableCell>
								{isProblem(t) && (
									<Button onClick={() => setSelected(t)}>Fix</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{selected && (
				<FixDialog
					task={selected}
					team={team}
					onClose={() => setSelected(null)}
					onFix={onFix}
				/>
			)}
		</>
	);
};
export default TasksTable;
