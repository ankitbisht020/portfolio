'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { FiSend } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';

const SUGGESTIONS = [
    'What has he built with AI?',
    'Summarize his work experience',
    'Which backend tech does he use?',
];

// Floating chat that answers questions grounded in the portfolio data (see app/api/ask/route.js).
const AskAI = ({ name = 'me' }) => {
    const firstName = name.split(' ')[0];
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener('open-ask-ai', onOpen);
        return () => window.removeEventListener('open-ask-ai', onOpen);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, loading]);

    const ask = async (text) => {
        const question = text.trim();
        if (!question || loading) return;
        const history = [...messages.filter((m) => !m.error), { role: 'user', content: question }];
        setMessages((m) => [...m, { role: 'user', content: question }]);
        setInput('');
        setLoading(true);
        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history.slice(-6).map(({ role, content }) => ({ role, content })) }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
            setMessages((m) => [...m, { role: 'assistant', content: json.answer }]);
        } catch (e) {
            setMessages((m) => [...m, { role: 'assistant', content: e.message, error: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label={`Ask AI about ${firstName}`}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="fixed z-[75] bottom-20 right-4 w-[min(380px,calc(100vw-2rem))] h-[min(520px,70vh)] flex flex-col bg-white dark:bg-grey-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-grey-900 overflow-hidden"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 bg-violet-600 text-white">
                            <HiSparkles size={20} />
                            <div className="flex-1">
                                <p className="font-medium leading-tight">Ask about {firstName}</p>
                                <p className="text-xs text-violet-100">Answers come from this portfolio&apos;s data</p>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 rounded hover:bg-violet-700">
                                <CgClose size={18} />
                            </button>
                        </div>

                        <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm" aria-live="polite">
                            <p className="bg-gray-100 dark:bg-grey-900 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                                Hi! Ask me anything about {firstName}&apos;s projects, skills or experience.
                            </p>
                            {messages.length === 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {SUGGESTIONS.map((s) => (
                                        <button key={s} type="button" onClick={() => ask(s)} className="text-left text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg px-3 py-2 transition-colors">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <p
                                    key={i}
                                    className={`whitespace-pre-wrap rounded-xl px-3 py-2 max-w-[85%] ${m.role === 'user'
                                        ? 'self-end bg-violet-600 text-white rounded-tr-sm'
                                        : m.error
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-tl-sm'
                                            : 'bg-gray-100 dark:bg-grey-900 rounded-tl-sm'}`}
                                >
                                    {m.content}
                                </p>
                            ))}
                            {loading && (
                                <p className="flex items-center gap-2 text-gray-500 text-xs"><BiLoaderAlt className="animate-spin" /> Thinking…</p>
                            )}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                ask(input);
                            }}
                            className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-grey-900"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                maxLength={500}
                                placeholder="Ask a question…"
                                aria-label="Your question"
                                className="flex-1 min-w-0 bg-gray-100 dark:bg-grey-900 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <button type="submit" disabled={loading || !input.trim()} aria-label="Send question" className="p-2.5 rounded-lg bg-violet-600 text-white disabled:opacity-50 hover:bg-violet-700 transition-colors">
                                <FiSend />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close AI assistant' : `Ask AI about ${firstName}`}
                className="fixed z-[75] bottom-4 right-4 flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/30 px-4 py-3 transition-colors"
            >
                {open ? <CgClose size={18} /> : <HiSparkles size={18} />}
                <span className="text-sm font-medium hidden sm:inline">{open ? 'Close' : 'Ask AI'}</span>
            </button>
        </>
    );
};

export default AskAI;
