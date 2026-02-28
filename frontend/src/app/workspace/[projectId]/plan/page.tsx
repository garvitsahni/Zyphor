'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, GripVertical, Trash2, Clock, Tag, Sparkles, RefreshCw } from 'lucide-react';
import { tasks as tasksApi, ai } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    estimatedHours: number;
    tags: string[];
    order: number;
}

const columns = [
    { key: 'backlog', label: 'Backlog', color: '#6C6C80' },
    { key: 'todo', label: 'To Do', color: '#6C5CE7' },
    { key: 'in-progress', label: 'In Progress', color: '#FDCB6E' },
    { key: 'review', label: 'Review', color: '#00CEC9' },
    { key: 'done', label: 'Done', color: '#00B894' },
];

const priorityColors: Record<string, string> = {
    low: 'tag-success', medium: 'tag', high: 'tag-warning', critical: 'tag-danger',
};

export default function PlanPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState<string | null>(null);
    const [newTask, setNewTask] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        tasksApi.list(projectId)
            .then(data => setTaskList(data.tasks || []))
            .finally(() => setLoading(false));
    }, [projectId]);

    const addTask = async (status: string) => {
        if (!newTask.trim()) return;
        try {
            const data = await tasksApi.create({ title: newTask, project: projectId, status });
            setTaskList(prev => [...prev, data.task]);
            setNewTask('');
            setShowAdd(null);
        } catch { /* ignore */ }
    };

    const moveTask = async (taskId: string, newStatus: string) => {
        setTaskList(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try { await tasksApi.update(taskId, { status: newStatus }); } catch { /* ignore */ }
    };

    const deleteTask = async (taskId: string) => {
        setTaskList(prev => prev.filter(t => t._id !== taskId));
        try { await tasksApi.delete(taskId); } catch { /* ignore */ }
    };

    const generateRoadmap = async () => {
        setGenerating(true);
        try {
            await ai.generateRoadmap({ projectId, teamSize: 3, hackathonDuration: 48, skills: ['frontend', 'backend', 'design'] });
            const data = await tasksApi.list(projectId);
            setTaskList(data.tasks || []);
        } catch { /* ignore */ }
        setGenerating(false);
    };

    const getTasksByStatus = (status: string) => taskList.filter(t => t.status === status);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 w-full" />)}
            </div>
        );
    }

    return (
        <PageContainer
            title="Kanban Board & Roadmap"
            subtitle="Drag tasks between columns to update progress"
            action={
                <button onClick={generateRoadmap} className="btn-primary text-sm flex items-center gap-2" disabled={generating}>
                    {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generating ? 'Generating...' : 'AI Generate Roadmap'}
                </button>
            }
        >

            {/* Board */}
            <div className="kanban-scroll flex gap-4 pb-4">
                {columns.map(col => (
                    <div key={col.key} className="min-w-[260px] w-full max-w-xs flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                                <span className="text-sm font-semibold">{col.label}</span>
                                <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-glass)] px-2 py-0.5 rounded-full">
                                    {getTasksByStatus(col.key).length}
                                </span>
                            </div>
                            <button onClick={() => setShowAdd(col.key)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2 min-h-[200px] p-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)]">
                            {showAdd === col.key && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-2">
                                    <input className="input-field text-sm mb-2" placeholder="Task title..." value={newTask}
                                        onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask(col.key)} autoFocus />
                                    <div className="flex gap-2">
                                        <button onClick={() => addTask(col.key)} className="btn-primary text-xs px-3 py-1.5 flex-1">Add</button>
                                        <button onClick={() => { setShowAdd(null); setNewTask(''); }} className="btn-ghost text-xs px-3 py-1.5">Cancel</button>
                                    </div>
                                </motion.div>
                            )}

                            {getTasksByStatus(col.key).map((task, i) => (
                                <motion.div
                                    key={task._id}
                                    className="card p-3 cursor-grab active:cursor-grabbing group"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    draggable
                                    onDragEnd={() => {
                                        const nextCol = columns[(columns.findIndex(c => c.key === col.key) + 1) % columns.length];
                                        moveTask(task._id, nextCol.key);
                                    }}
                                >
                                    <div className="flex items-start gap-2">
                                        <GripVertical className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{task.title}</p>
                                            {task.description && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>}
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className={`${priorityColors[task.priority]} text-[10px]`}>{task.priority}</span>
                                                {task.estimatedHours > 0 && (
                                                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                                                        <Clock className="w-3 h-3" />{task.estimatedHours}h
                                                    </span>
                                                )}
                                                {task.tags?.map(tag => (
                                                    <span key={tag} className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                                                        <Tag className="w-2.5 h-2.5" />{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteTask(task._id)}
                                            className="text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
}
