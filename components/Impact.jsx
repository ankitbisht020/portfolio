import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { MdOutlineEmojiEvents } from 'react-icons/md';
import SectionWrapper from './SectionWrapper';

// Counts up from 0 once the number scrolls into view.
const Counter = ({ value, prefix = '', suffix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const target = Number(value) || 0;
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(target);
            return;
        }
        const controls = animate(0, target, {
            duration: 1.4,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, target]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

// Used when the database has no "stats" node yet, so the section never renders empty.
const fallbackStats = (data) => [
    { value: data.projects?.length || 0, suffix: '+', label: 'Projects built' },
    { value: data.skills?.length || 0, suffix: '+', label: 'Technologies used' },
    { value: data.experiences?.length || 0, label: 'Companies worked with' },
    { value: data.achievements?.length || 0, label: 'Milestones reached' },
];

const Impact = ({ stats, achievements = [], data }) => {
    const statList = (Array.isArray(stats) && stats.length ? stats : fallbackStats(data)).slice(0, 4);
    const milestones = [...achievements].reverse();

    return (
        <SectionWrapper id="impact" className="mx-4 md:mx-0 py-16 md:py-24">
            <h2 className="text-4xl text-center">Impact</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                Numbers from production work, and the milestones behind them.
            </p>

            <div className="lg:w-5/6 2xl:w-3/4 mx-auto mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statList.map((s, i) => (
                    <div key={`${s.label}-${i}`} className="bg-white dark:bg-grey-800 rounded-2xl p-5 md:p-7 border border-transparent hover:border-violet-300 dark:hover:border-violet-800 transition-colors">
                        <p className="text-3xl md:text-5xl font-bold text-violet-700 dark:text-violet-500 tabular-nums">
                            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                        </p>
                        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">{s.label}</p>
                    </div>
                ))}
            </div>

            {milestones.length > 0 && (
                <div className="lg:w-5/6 2xl:w-3/4 mx-auto mt-10 md:mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {milestones.map((a, i) => (
                        <motion.article
                            key={`${a.title}-${i}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                            className="group bg-white dark:bg-grey-800 rounded-2xl p-5 flex gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                        >
                            <span className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <MdOutlineEmojiEvents size={20} />
                            </span>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{a.date}</p>
                                <h3 className="font-medium mt-0.5">{a.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{a.details}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}
        </SectionWrapper>
    );
};

export default Impact;
