import React, { useMemo } from 'react';
import type { Project, Task, User } from '../types';
import { Box, Button, Typography, Select, MenuItem } from '@mui/material';

interface Props {
	projects: Project[];
	projectId: string;
	onProjectChange: (id: string) => void;
	onAutoAssign: () => void;
	tasks: Task[];
	team: User[];
}

const ControlPanel: React.FC<Props> = ({
	projects,
	projectId,
	onProjectChange,
	onAutoAssign,
	tasks,
}) => {
	const stats = useMemo(() => {
		const total = tasks.length;
		const done = tasks.filter((t) => t.status === 'Done').length;
		return {
			total,
			done,
			percent: total ? Math.round((done / total) * 100) : 0,
		};
	}, [tasks]);

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			mb={2}
		>
			<Typography variant="h6">
				Project Progress: {stats.percent}% ({stats.done}/{stats.total})
			</Typography>
			<Box display="flex" alignItems="center" gap={2}>
				<Select
					value={projectId}
					onChange={(e) => onProjectChange(e.target.value)}
				>
					{projects.map((p) => (
						<MenuItem key={p.id} value={p.id}>
							{p.name}
						</MenuItem>
					))}
				</Select>
				<Button variant="contained" onClick={onAutoAssign}>
					Auto-assign unassigned
				</Button>
			</Box>
		</Box>
	);
};
export default ControlPanel;
