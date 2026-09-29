import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';
import SectionWrapper from './SectionWrapper';
import { goTo, copyText } from '@/lib/scroll';
import { CONTACT_EMAIL, hasLink, socialName } from '@/lib/site';

const PROMPT = 'guest@ankit:~$';
const QUICK = ['help', 'whoami', 'skills', 'projects', 'experience', 'contact'];
const SECTIONS = ['home', 'about', 'impact', 'skills', 'projects', 'experience', 'contact'];

const A = ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">
        {children}
    </a>
);

const Muted = ({ children }) => <span className="text-gray-500">{children}</span>;

// Every command returns lines to print. Commands read straight from the Firebase data,
// so the terminal stays in sync with the rest of the site.
const buildCommands = (data, { run, getCommands, setTheme, resolvedTheme }) => {
    const { main = {}, about = {}, skills = [], projects = [], experiences = [], educations = [], achievements = [], socials = [] } = data;
    const latestProjects = [...projects].reverse();

    return {
        help: {
            desc: 'List available commands',
            run: () => [
                'Available commands:',
                ...Object.entries(getCommands())
                    .filter(([, c]) => !c.hidden)
                    .map(([name, c]) => (
                        <span key={name}>
                            <button type="button" onClick={() => run(name)} className="text-emerald-300 hover:underline w-28 inline-block text-left">{name}</button>
                            <Muted>{c.desc}</Muted>
                        </span>
                    )),
                <Muted key="tip">Tip: Tab autocompletes, ↑/↓ browse history.</Muted>,
            ],
        },
        whoami: {
            desc: 'Who is Ankit?',
            run: () => [
                <span key="n" className="text-white font-semibold">{main.name} <Muted>— {about.title}</Muted></span>,
                main.shortDesc,
            ],
        },
        about: { desc: 'The longer story', run: () => [about.about] },
        skills: {
            desc: 'Tech stack by category (try: skills backend)',
            run: (args) => {
                const groups = skills.reduce((acc, s) => ((acc[s.category] ||= []).push(s.name), acc), {});
                const filter = args[0]?.toLowerCase();
                const entries = Object.entries(groups).filter(([cat]) => !filter || cat.toLowerCase().startsWith(filter));
                if (!entries.length) return [`No category "${args[0]}". Try: ${Object.keys(groups).join(', ').toLowerCase()}`];
                return entries.map(([cat, names]) => (
                    <span key={cat}><span className="text-amber-300">{cat.padEnd(10)}</span> {names.join(', ')}</span>
                ));
            },
        },
        projects: {
            desc: 'Things I have built',
            run: () => [
                ...latestProjects.map((p, i) => (
                    <span key={p.name}>
                        <span className="text-amber-300">[{i + 1}]</span> <span className="text-white">{p.name}</span> <Muted>— {p.techstack}</Muted>
                    </span>
                )),
                <Muted key="tip">Type &quot;open 1&quot; to open a project&apos;s live site or code.</Muted>,
            ],
        },
        open: {
            desc: 'Open a project by number (open 1)',
            run: (args) => {
                const n = parseInt(args[0], 10);
                const p = latestProjects[n - 1];
                if (!p) return [`Usage: open <1-${latestProjects.length}>`];
                const url = [p.links?.visit, p.links?.code, p.links?.video].find(hasLink);
                if (!url) return [`${p.name} is a private/client project, so there is no public link. Ask me about it via "contact".`];
                window.open(url, '_blank', 'noopener');
                return [<span key="o">Opening <A href={url}>{url}</A></span>];
            },
        },
        experience: {
            desc: 'Where I have worked',
            run: () => [...experiences].reverse().flatMap((e, i) => [
                <span key={`e${i}`}><span className="text-white">{e.position}</span> @ <span className="text-amber-300">{e.company}</span> <Muted>({e.duration?.trim()})</Muted></span>,
                ...(e.desc || []).slice(0, 2).map((d, j) => <span key={`e${i}-${j}`} className="pl-4 block">• {d}</span>),
            ]),
        },
        education: {
            desc: 'Degrees and schooling',
            run: () => [...educations].reverse().map((e, i) => (
                <span key={i}><span className="text-white">{e.degree}</span> <Muted>— {e.institute} ({e.duration})</Muted></span>
            )),
        },
        achievements: {
            desc: 'Milestones and wins',
            run: () => [...achievements].reverse().map((a, i) => (
                <span key={i}><span className="text-amber-300">{a.date}</span> {a.title}</span>
            )),
        },
        contact: {
            desc: 'How to reach me',
            run: () => [
                <span key="m">Email: <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> <Muted>(type &quot;email&quot; to copy)</Muted></span>,
                ...socials.map((s) => <span key={s.link}>{socialName(s.icon).padEnd(11)} <A href={s.link}>{s.link.replace(/^https?:\/\/(www\.)?/, '')}</A></span>),
            ],
        },
        email: {
            desc: 'Copy my email address',
            run: () => {
                copyText(CONTACT_EMAIL).then((ok) => ok && toast.success('Email copied!'));
                return [`Copied ${CONTACT_EMAIL} to your clipboard.`];
            },
        },
        resume: {
            desc: 'Open my resume',
            run: () => {
                if (!hasLink(about.resumeUrl)) return ['Resume link is not available right now.'];
                window.open(about.resumeUrl, '_blank', 'noopener');
                return [<span key="r">Opening <A href={about.resumeUrl}>resume</A>…</span>];
            },
        },
        goto: {
            desc: 'Scroll to a section (goto projects)',
            run: (args) => {
                const target = args[0]?.toLowerCase();
                if (!SECTIONS.includes(target)) return [`Usage: goto <${SECTIONS.join('|')}>`];
                setTimeout(() => goTo(target), 150);
                return [`Scrolling to ${target}…`];
            },
        },
        theme: {
            desc: 'Switch theme (theme dark | theme light)',
            run: (args) => {
                const next = ['dark', 'light'].includes(args[0]) ? args[0] : resolvedTheme === 'dark' ? 'light' : 'dark';
                setTheme(next);
                return [`Theme set to ${next}.`];
            },
        },
        clear: { desc: 'Clear the screen', run: () => null },
        sudo: {
            desc: 'Try it',
            hidden: true,
            run: (args) => {
                if (args.join(' ') === 'hire-ankit') {
                    setTimeout(() => goTo('contact'), 600);
                    return [<span key="s" className="text-emerald-300">Permission granted. Taking you to the contact form…</span>];
                }
                return ['Nice try. Only "sudo hire-ankit" is allowed here.'];
            },
        },
    };
};

const Terminal = ({ data }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [lines, setLines] = useState(() => [
        { type: 'out', content: [`Welcome to ${data.main?.name?.split(' ')[0] || 'my'}'s terminal. Type "help" to see what you can do, or tap a command below.`] },
    ]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [histIndex, setHistIndex] = useState(-1);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const commandsRef = useRef({});

    const run = (raw) => {
        const text = raw.trim();
        if (!text) return;
        const [name, ...args] = text.split(/\s+/);
        const cmd = commandsRef.current[name.toLowerCase()];
        setHistory((h) => [...h.filter((x) => x !== text), text]);
        setHistIndex(-1);
        setInput('');

        if (name.toLowerCase() === 'clear') {
            setLines([]);
            return;
        }
        const output = cmd ? cmd.run(args) : [`command not found: ${name}. Type "help" for a list of commands.`];
        setLines((prev) => [...prev, { type: 'cmd', content: text }, { type: 'out', content: output || [] }].slice(-120));
    };

    const commands = useMemo(
        () => buildCommands(data, { run, getCommands: () => commandsRef.current, setTheme, resolvedTheme }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, resolvedTheme]
    );
    commandsRef.current = commands;

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            run(input);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            const i = histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
            setHistIndex(i);
            setInput(history[i]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIndex === -1) return;
            const i = histIndex + 1;
            if (i >= history.length) {
                setHistIndex(-1);
                setInput('');
            } else {
                setHistIndex(i);
                setInput(history[i]);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const matches = Object.keys(commands).filter((c) => !commands[c].hidden && c.startsWith(input.toLowerCase()));
            if (matches.length === 1) setInput(matches[0] + ' ');
            else if (matches.length > 1) setLines((prev) => [...prev, { type: 'out', content: [matches.join('   ')] }]);
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    return (
        <SectionWrapper id="terminal" className="mx-4 md:mx-0 py-16">
            <h2 className="text-4xl text-center">Terminal</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-3 text-sm md:text-base">
                Prefer the command line? Explore my portfolio from here.
            </p>

            <div className="lg:w-4/6 2xl:w-1/2 mx-auto mt-8 rounded-xl overflow-hidden shadow-2xl shadow-violet-900/20 border border-grey-800 bg-grey-900 text-gray-200">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-grey-800 border-b border-black/30">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-gray-400 font-mono">ankit@portfolio — zsh</span>
                </div>

                <div
                    ref={bodyRef}
                    onClick={() => inputRef.current?.focus({ preventScroll: true })}
                    className="terminal-scroll h-80 md:h-96 overflow-y-auto p-4 font-mono text-[13px] md:text-sm leading-relaxed cursor-text"
                    role="log"
                    aria-live="polite"
                >
                    {lines.map((line, i) =>
                        line.type === 'cmd' ? (
                            <p key={i} className="mt-2"><span className="text-violet-400">{PROMPT}</span> {line.content}</p>
                        ) : (
                            <div key={i} className="whitespace-pre-wrap break-words">
                                {line.content.map((c, j) => <div key={j}>{c}</div>)}
                            </div>
                        )
                    )}

                    <label className="flex items-center gap-2 mt-2">
                        <span className="text-violet-400 shrink-0">{PROMPT}</span>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="flex-1 min-w-0 bg-transparent outline-none text-white caret-violet-400"
                            aria-label="Terminal command"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                        />
                    </label>
                </div>

                <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-grey-800 bg-grey-900">
                    {QUICK.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => run(c)}
                            className="font-mono text-xs px-2.5 py-1 rounded-md bg-grey-800 hover:bg-violet-700 hover:text-white text-gray-300 transition-colors"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Terminal;
