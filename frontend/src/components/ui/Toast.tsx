'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />,
    error: <XCircle className="w-4 h-4 text-[var(--danger)]" />,
    info: <Info className="w-4 h-4 text-[var(--primary-light)]" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
                bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg min-w-[280px]
                ${t.type === 'success' ? 'border-l-[3px] border-l-[var(--success)]' : ''}
                ${t.type === 'error' ? 'border-l-[3px] border-l-[var(--danger)]' : ''}
                ${t.type === 'info' ? 'border-l-[3px] border-l-[var(--primary)]' : ''}
              `}
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {icons[t.type]}
                            <span className="text-sm text-[var(--text-primary)] flex-1">{t.message}</span>
                            <button onClick={() => removeToast(t.id)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
