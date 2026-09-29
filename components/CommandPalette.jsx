'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';
import { FiSearch, FiArrowRight, FiCopy, FiFileText, FiMoon, FiSun, FiTerminal, FiFolder, FiExternalLink } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { goTo, copyText } from '@/lib/scroll';
import { CONTACT_EMAIL, hasLink, socialName } from '@/lib/site';

const SECTIONS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About me' },
    { id: 'impact', label: 'Impact & achievements' },
    { id: 'skills', label: 'Tech stack' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience & education' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'contact', label: 'Contact' },
];

const matches = (item, query) => {
    const haystack = `${item.label} ${item.hint || ''} ${item.group}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every((word) => haystack.includes(word));
};

// ⌘K / Ctrl+K menu: jump to sections, open projects, copy email, switch theme.
const CommandPalette = ({ data, aiEnabled }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        const onOpen = () => setOpen(true);
        window.addEventListener('keydown', onKey);
        window.addEventListener('open-command-palette', onOpen);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('open-command-palette', onOpen);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        setQuery('');
        setActiveIndex(0);
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const t = setTimeout(() => inputRef.current?.focus(), 30);
        return () => {
            clearTimeout(t);
            document.body.style.overflow = previous;
        };
    }, [open]);

    const items = useMemo(() => {
        const resumeUrl = data.about?.resumeUrl;
        const list = [
            ...SECTIONS.map((s) => ({ group: 'Go to', label: s.label, hint: s.id, Icon: s.id === 'terminal' ? FiTerminal : FiArrowRight, run: () => goTo(s.id) })),
            {
                group: 'Actions',
                label: resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
                hint: 'theme toggle',
                Icon: resolvedTheme === 'dark' ? FiSun : FiMoon,
                run: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
            },
            {
                group: 'Actions',
                label: 'Copy email address',
                hint: CONTACT_EMAIL,
                Icon: FiCopy,
                run: async () => ((await copyText(CONTACT_EMAIL)) ? toast.success('Email copied!') : toast.info(CONTACT_EMAIL)),
            },
            hasLink(resumeUrl) && { group: 'Actions', label: 'Open resume', hint: 'cv pdf', Icon: FiFileText, run: () => window.open(resumeUrl, '_blank', 'noopener') },
            aiEnabled && { group: 'Actions', label: 'Ask AI about me', hint: 'chat assistant', Icon: HiSparkles, run: () => window.dispatchEvent(new Event('open-ask-ai')) },
            ...[...(data.projects || [])].reverse().map((p) => ({
                group: 'Projects',
                label: p.name,
                hint: p.techstack,
                Icon: FiFolder,
                run: () => {
                    goTo('projects');
                    setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: p.name })), 550);
                },
            })),
            ...(data.socials || []).map((s) => ({
                group: 'Socials',
                label: socialName(s.icon),
                hint: s.link,
                Icon: FiExternalLink,
                run: () => window.open(s.link, '_blank', 'noopener'),
            })),
        ];
        return list.filter(Boolean);
    }, [data, aiEnabled, resolvedTheme, setTheme]);

    const filtered = query.trim() ? items.filter((i) => matches(i, query)) : items;

    useEffect(() => setActiveIndex(0), [query]);

    useEffect(() => {
        listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const select = (item) => {
        if (!item) return;
        setOpen(false);
        setTimeout(item.run, 60);
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            select(filtered[activeIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    let lastGroup = null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-start justify-center px-4 pt-[12vh]"
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command menu"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="w-full max-w-xl bg-white dark:bg-grey-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-grey-900"
                    >
                        <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-grey-900">
                            <FiSearch className="text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Search sections, projects, actions…"
                                className="w-full py-4 bg-transparent outline-none text-base"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="command-list"
                                aria-activedescendant={filtered[activeIndex] ? `cmd-${activeIndex}` : undefined}
                            />
                            <kbd className="hidden sm:block text-xs text-gray-400 border border-gray-200 dark:border-grey-900 rounded px-1.5 py-0.5">Esc</kbd>
                        </div>

                        <ul id="command-list" ref={listRef} role="listbox" className="max-h-[55vh] overflow-y-auto py-2">
                            {filtered.length === 0 && (
                                <li className="px-4 py-8 text-center text-sm text-gray-500">No results for &quot;{query}&quot;. Try &quot;projects&quot; or &quot;email&quot;.</li>
                            )}
                            {filtered.map((item, i) => {
                                const showGroup = item.group !== lastGroup;
                                lastGroup = item.group;
                                const isActive = i === activeIndex;
                                return (
                                    <li key={`${item.group}-${item.label}`} role="presentation">
                                        {showGroup && <p className="px-4 pt-3 pb-1 text-xs text-gray-400">{item.group}</p>}
                                        <button
                                            id={`cmd-${i}`}
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            data-active={isActive}
                                            onMouseMove={() => setActiveIndex(i)}
                                            onClick={() => select(item)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${isActive ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300' : ''}`}
                                        >
                                            <item.Icon className="shrink-0 opacity-70" />
                                            <span className="truncate">{item.label}</span>
                                            {item.group === 'Projects' && item.hint && (
                                                <span className="ml-auto truncate max-w-[45%] text-xs text-gray-400">{item.hint}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 text-xs text-gray-400 border-t border-gray-100 dark:border-grey-900">
                            <span>↑↓ to navigate</span>
                            <span>Enter to select</span>
                            <span className="ml-auto">{CONTACT_EMAIL}</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
