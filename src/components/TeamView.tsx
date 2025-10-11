import React from 'react';
import type { Task, User } from '../types';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
} from '@mui/material';

interface Props {
	team: User[];
	tasks: Task[];
}

const TeamView: React.FC<Props> = ({ team, tasks }) => {
	const countTasks = (id: string) =>
		tasks.filter((t) => t.assigneeId === id).length;
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>Active</TableCell>
					<TableCell>Assigned Tasks</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{team.map((u) => (
					<TableRow key={u.id}>
						<TableCell>{u.name}</TableCell>
						<TableCell>
							<Chip
								label={u.active ? 'Active' : 'Inactive'}
								color={u.active ? 'success' : 'default'}
							/>
						</TableCell>
						<TableCell>{countTasks(u.id)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default TeamView;
