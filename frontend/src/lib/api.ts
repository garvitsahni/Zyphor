const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Auth helpers
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('zyphra_token');
}

export function setToken(token: string) {
    localStorage.setItem('zyphra_token', token);
}

export function removeToken() {
    localStorage.removeItem('zyphra_token');
}

async function request(path: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// Auth
export const auth = {
    register: (body: { name: string; email: string; password: string; skills?: string[] }) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
    updateProfile: (body: Record<string, unknown>) =>
        request('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
};

// Projects
export const projects = {
    list: () => request('/projects'),
    get: (id: string) => request(`/projects/${id}`),
    create: (body: Record<string, unknown>) =>
        request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
        request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),
    activity: (id: string) => request(`/projects/${id}/activity`),
    addCollaborator: (id: string, body: { email: string; role?: string }) =>
        request(`/projects/${id}/collaborators`, { method: 'POST', body: JSON.stringify(body) }),
    portfolio: (id: string) => request(`/projects/portfolio/${id}`),
};

// Tasks
export const tasks = {
    list: (projectId: string) => request(`/tasks/project/${projectId}`),
    create: (body: Record<string, unknown>) =>
        request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
        request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
    reorder: (taskUpdates: Array<{ id: string; order: number; status: string }>) =>
        request('/tasks/reorder', { method: 'POST', body: JSON.stringify({ tasks: taskUpdates }) }),
};

// AI Modules
export const ai = {
    validateIdea: (body: Record<string, unknown>) =>
        request('/ai/validate', { method: 'POST', body: JSON.stringify(body) }),
    generateRoadmap: (body: Record<string, unknown>) =>
        request('/ai/roadmap', { method: 'POST', body: JSON.stringify(body) }),
    predictDeadline: (body: { projectId: string }) =>
        request('/ai/deadline', { method: 'POST', body: JSON.stringify(body) }),
    simulateJudge: (body: { projectId: string }) =>
        request('/ai/judge', { method: 'POST', body: JSON.stringify(body) }),
    generatePresentation: (body: { projectId: string }) =>
        request('/ai/presentation', { method: 'POST', body: JSON.stringify(body) }),
    generateStartup: (body: { projectId: string }) =>
        request('/ai/startup', { method: 'POST', body: JSON.stringify(body) }),
    chat: (body: { projectId?: string; message: string; context?: string }) =>
        request('/ai/assistant', { method: 'POST', body: JSON.stringify(body) }),
};

// GitHub
export const github = {
    repos: () => request('/github/repos'),
    commits: (repo: string) => request(`/github/commits/${repo}`),
    heatmap: (repo: string) => request(`/github/heatmap/${repo}`),
    connect: (body: { projectId: string; repoUrl: string }) =>
        request('/github/connect', { method: 'POST', body: JSON.stringify(body) }),
};
