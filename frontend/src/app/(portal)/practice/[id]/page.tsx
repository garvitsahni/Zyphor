'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, Terminal } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';

export default function ProblemSolvingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [code, setCode] = useState('function twoSum(nums, target) {\n    // Write your code here\n    \n}');
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);

    // Mock problem data
    const problem = {
        title: 'Two Sum',
        difficulty: 'Easy',
        points: 10,
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
        ]
    };

    const runCode = () => {
        setStatus('running');
        setResult(null);

        // Simulate API call to execute code
        setTimeout(() => {
            // Simple validation based on length for demonstration
            if (code.length < 50) {
                setStatus('error');
                setResult({
                    message: 'SyntaxError: Unexpected token',
                    testsPassed: 0,
                    totalTests: 3
                });
            } else {
                setStatus('success');
                setResult({
                    message: 'Success',
                    time: '45ms',
                    memory: '41.2 MB',
                    testsPassed: 3,
                    totalTests: 3,
                    pointsEarned: 10
                });
            }
        }, 1500);
    };

    return (
        <PageContainer>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/practice" className="p-2 bg-[var(--bg-glass)] rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">{problem.difficulty}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">+{problem.points} pts</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)] min-h-[600px]">

                {/* Left Panel: Description */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl flex flex-col overflow-hidden">
                    <div className="flex px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border)]">
                        <button className="text-sm font-semibold border-b-2 border-[var(--primary)] text-white px-2 py-1">Description</button>
                        <button className="text-sm font-semibold text-[var(--text-muted)] hover:text-white px-4 py-1">Solutions</button>
                        <button className="text-sm font-semibold text-[var(--text-muted)] hover:text-white px-4 py-1">Submissions</button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-wrap text-[var(--text-secondary)]">{problem.description}</p>

                            <h3 className="text-lg font-bold mt-8 mb-4">Examples</h3>
                            <div className="space-y-4">
                                {problem.examples.map((ex, i) => (
                                    <div key={i} className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border)]">
                                        <p className="text-sm mb-1"><span className="font-semibold text-white">Input:</span> <span className="text-[var(--text-muted)]">{ex.input}</span></p>
                                        <p className="text-sm mb-1"><span className="font-semibold text-white">Output:</span> <span className="text-[var(--text-muted)]">{ex.output}</span></p>
                                        {ex.explanation && (
                                            <p className="text-sm"><span className="font-semibold text-white">Explanation:</span> <span className="text-[var(--text-muted)]">{ex.explanation}</span></p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Editor & Output */}
                <div className="flex flex-col gap-4">

                    {/* Editor */}
                    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl flex flex-col flex-1 overflow-hidden shadow-lg">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border)] bg-[#1e1e1e]">
                            <select className="bg-transparent text-sm text-[var(--text-muted)] hover:text-white outline-none cursor-pointer p-1">
                                <option>JavaScript</option>
                                <option>Python</option>
                                <option>C++</option>
                                <option>Java</option>
                            </select>
                            <button onClick={() => setCode('function twoSum(nums, target) {\n    // Write your code here\n    \n}')} className="text-[var(--text-muted)] hover:text-white p-1">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 p-4 bg-[#1e1e1e] font-mono text-sm">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full bg-transparent text-gray-300 resize-none outline-none custom-scrollbar"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Console / Output */}
                    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl flex flex-col h-48 overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                            <span className="text-sm font-semibold flex items-center gap-2"><Terminal className="w-4 h-4" /> Console</span>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[var(--bg-glass)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">Run Custom Test</button>
                                <button
                                    onClick={runCode}
                                    disabled={status === 'running'}
                                    className="px-4 py-1.5 rounded-lg text-sm font-bold bg-green-500 hover:bg-green-600 text-green-950 transition-colors flex items-center gap-2 disabled:opacity-50">
                                    {status === 'running' ? 'Running...' : <><Play className="w-4 h-4 fill-green-950" /> Submit Code</>}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-black/20">
                            {status === 'idle' && <p className="text-sm text-[var(--text-muted)] italic">Run code to see output...</p>}

                            {status === 'running' && (
                                <div className="flex items-center gap-3 text-[var(--primary-light)]">
                                    <div className="w-4 h-4 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
                                    <span>Executing against test cases...</span>
                                </div>
                            )}

                            {status === 'success' && result && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 className="text-xl font-bold text-green-400 mb-2">{result.message}</h3>
                                    <div className="flex gap-6 text-sm text-gray-400 mb-3">
                                        <p>Runtime: <span className="text-white font-mono">{result.time}</span></p>
                                        <p>Memory: <span className="text-white font-mono">{result.memory}</span></p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <div>
                                            <p className="font-semibold text-green-400">All tests passed ({result.testsPassed}/{result.totalTests})</p>
                                            <p className="text-xs text-green-500/70">You earned +{result.pointsEarned} Zyphor Coins!</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && result && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Compile Error</h3>
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg font-mono text-sm text-red-300">
                                        {result.message}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </PageContainer>
    );
}
