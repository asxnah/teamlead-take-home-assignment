import React, { useEffect, useState } from 'react';
import {
	Container,
	Tabs,
	Tab,
	Box,
	CircularProgress,
	Snackbar,
	Alert,
} from '@mui/material';
import {
	getProjects,
	getTasks,
	getTeam,
	updateTask,
	bulkAutoAssign,
} from './mockApi';
import type { Task, User, Project } from './types';
import TasksTable from './components/TasksTable';
import TeamView from './components/TeamView';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectId, setProjectId] = useState<string>('');
	const [tasks, setTasks] = useState<Task[]>([]);
	const [team, setTeam] = useState<User[]>([]);
	const [tab, setTab] = useState<'tasks' | 'team'>('tasks');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [snackbar, setSnackbar] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const projs = await getProjects();
				setProjects(projs);
				if (projs.length) setProjectId(projs[0].id);
			} catch (e) {
				setError('Failed to load projects');
				console.error(e);
			}
		})();
	}, []);

	useEffect(() => {
		if (!projectId) return;
		(async () => {
			try {
				setLoading(true);
				const [t, teamList] = await Promise.all([
					getTasks(projectId),
					getTeam(projectId),
				]);
				setTasks(t);
				setTeam(teamList);
			} catch (e) {
				setError('Failed to load data');
				console.error(e);
			} finally {
				setLoading(false);
			}
		})();
	}, [projectId]);

	const handleUpdateTask = async (taskId: string, patch: Partial<Task>) => {
		try {
			const updated = await updateTask(projectId, taskId, patch);
			setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
			setSnackbar('Task updated successfully');
		} catch {
			setError('Failed to update task');
		}
	};

	const handleAutoAssign = async () => {
		try {
			setLoading(true);
			const updatedTasks = await bulkAutoAssign(projectId);
			setTasks(updatedTasks);
			setSnackbar('Unassigned tasks auto-assigned');
		} catch {
			setError('Failed to auto-assign');
		} finally {
			setLoading(false);
		}
	};

	if (loading)
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	if (error) return <Alert severity="error">{error}</Alert>;

	return (
		<Container sx={{ mt: 4 }}>
			<ControlPanel
				projects={projects}
				projectId={projectId}
				onProjectChange={setProjectId}
				onAutoAssign={handleAutoAssign}
				tasks={tasks}
				team={team}
			/>
			<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
				<Tab label="Tasks" value="tasks" />
				<Tab label="Team" value="team" />
			</Tabs>
			{tab === 'tasks' && (
				<TasksTable tasks={tasks} team={team} onFix={handleUpdateTask} />
			)}
			{tab === 'team' && <TeamView team={team} tasks={tasks} />}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
			>
				<Alert severity="success">{snackbar}</Alert>
			</Snackbar>
		</Container>
	);
};

export default App;
