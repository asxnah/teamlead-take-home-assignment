import type { Task, User, Project } from './types';

// имитация задержки
const randomDelay = (min = 200, max = 800) =>
	new Promise((res) => setTimeout(res, Math.random() * (max - min) + min));

// временная бд
const projects: Project[] = [
	{ id: 'p1', name: 'Website Redesign' },
	{ id: 'p2', name: 'Mobile App' },
];

const users: Record<string, User[]> = {
	p1: [
		{ id: 'u1', name: 'Bob', active: true },
		{ id: 'u2', name: 'John', active: true },
		{ id: 'u3', name: 'Max', active: false },
	],
	p2: [
		{ id: 'u4', name: 'Stacy', active: true },
		{ id: 'u5', name: 'Emma', active: true },
		{ id: 'u6', name: 'Andrew', active: true },
	],
};

const tasks: Record<string, Task[]> = {
	p1: [
		{
			id: 't1',
			key: 'P1-1',
			summary: 'Design homepage layout',
			status: 'In Progress',
			assigneeId: 'u1',
			priority: 'High',
			dueDate: '2025-10-15',
			updatedAt: '2025-10-09',
		},
		{
			id: 't2',
			key: 'P1-2',
			summary: 'Fix navbar responsiveness',
			status: 'To Do',
			assigneeId: null,
			priority: 'Medium',
			dueDate: '2025-10-17',
			updatedAt: '2025-10-10',
		},
		{
			id: 't3',
			key: 'P1-3',
			summary: 'Update color palette',
			status: 'To Do',
			assigneeId: 'u2',
			priority: 'Low',
			dueDate: '2025-10-12',
			updatedAt: '2025-10-10',
		},
	],
	p2: [
		{
			id: 't4',
			key: 'P2-1',
			summary: 'Implement login screen',
			status: 'In Progress',
			assigneeId: 'u4',
			priority: 'High',
			dueDate: '2025-10-20',
			updatedAt: '2025-10-09',
		},
		{
			id: 't5',
			key: 'P2-2',
			summary: 'Add dark mode toggle',
			status: 'To Do',
			assigneeId: null,
			priority: 'Low',
			dueDate: '2025-10-13',
			updatedAt: '2025-10-10',
		},
	],
};

// получить список проектов
export async function getProjects(): Promise<Project[]> {
	await randomDelay();
	return projects.slice();
}

// получить команду проекта
export async function getTeam(projectId: string): Promise<User[]> {
	await randomDelay();
	return (users[projectId] || []).map((u) => ({ ...u }));
}

// получить список задач проекта
export async function getTasks(projectId: string): Promise<Task[]> {
	await randomDelay();
	return (tasks[projectId] || []).map((t) => ({ ...t }));
}

// обновить задачу по id
export async function updateTask(
	projectId: string,
	taskId: string,
	patch: Partial<Task>
): Promise<Task> {
	await randomDelay();
	const list = tasks[projectId] || [];
	const idx = list.findIndex((t) => t.id === taskId);
	if (idx === -1) throw new Error('Task not found');

	const updated: Task = {
		...list[idx],
		...patch,
		updatedAt: new Date().toISOString(),
	};
	list[idx] = updated;
	tasks[projectId] = list;
	return { ...updated };
}

// массовое автоназначение задач без исполнителя
export async function bulkAutoAssign(projectId: string): Promise<Task[]> {
	await randomDelay(300, 1200);
	const team = users[projectId] || [];
	const active = team.filter((u) => u.active);

	if (active.length === 0) throw new Error('No active users to assign to');

	const list = tasks[projectId] || [];
	const unassigned = list.filter((t) => !t.assigneeId);

	unassigned.forEach((t) => {
		const pick = active[Math.floor(Math.random() * active.length)];
		t.assigneeId = pick.id;
		t.updatedAt = new Date().toISOString();
	});

	tasks[projectId] = list;
	return list.map((t) => ({ ...t }));
}
