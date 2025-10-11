export interface Project {
	id: string;
	name: string;
}

export interface User {
	id: string;
	name: string;
	active: boolean;
}

export interface Task {
	id: string;
	key: string;
	summary: string;
	status: 'To Do' | 'In Progress' | 'Done';
	assigneeId: string | null;
	priority: 'Low' | 'Medium' | 'High';
	dueDate: string;
	updatedAt: string;
}
