import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaGithub, FaVideo } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { FiMaximize2 } from "react-icons/fi";
import { motion, useSpring } from 'framer-motion';
import { hasLink, splitStack } from "@/lib/site";

const linkButtons = [
    { key: 'visit', label: 'Live site', Icon: BiLinkExternal },
    { key: 'code', label: 'Source code', Icon: FaGithub },
    { key: 'video', label: 'Demo video', Icon: FaVideo },
];

// forwardRef lets AnimatePresence (popLayout) measure the card while it animates out.
const Project = forwardRef(function Project({ project, onOpen }, outerRef) {
    const { name, image, category, techstack, links = {} } = project;
    const chips = splitStack(techstack);
    const tiltRef = useRef(null);
    const [canTilt, setCanTilt] = useState(false);
    const rotateX = useSpring(0, { stiffness: 220, damping: 18 });
    const rotateY = useSpring(0, { stiffness: 220, damping: 18 });

    useEffect(() => {
        setCanTilt(
            window.matchMedia('(pointer: fine)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }, []);

    const onMove = (e) => {
        if (!canTilt || !tiltRef.current) return;
        const r = tiltRef.current.getBoundingClientRect();
        rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const reset = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.article
            ref={outerRef}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ perspective: 900 }}
        >
            <motion.div
                ref={tiltRef}
                onMouseMove={onMove}
                onMouseLeave={reset}
                style={{ rotateX, rotateY }}
                onClick={onOpen}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${name}`}
                className="group h-full flex flex-col gap-2 bg-white dark:bg-grey-800 rounded-lg p-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500 hover:shadow-xl hover:shadow-violet-900/10 transition-shadow"
            >
                <div className="relative overflow-hidden rounded-lg bg-violet-50 dark:bg-grey-900">
                    {image ? (
                        <Image alt={name} width={960} height={540} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="w-full h-48 object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-500" src={image} />
                    ) : (
                        <div className="h-48 grid place-items-center text-violet-600 text-2xl font-semibold">{name}</div>
                    )}
                    <span className="absolute top-2 right-2 flex items-center gap-1.5 text-xs bg-black/60 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiMaximize2 size={12} /> Details
                    </span>
                </div>

                <div className="my-2 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-medium">{name}</h3>
                        <span className="shrink-0 text-xs text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded px-2 py-1 capitalize">{category}</span>
                    </div>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                        {chips.slice(0, 5).map((t) => (
                            <li key={t} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-grey-900 rounded-md px-2 py-1">{t}</li>
                        ))}
                        {chips.length > 5 && <li className="text-xs text-gray-400 px-1 py-1">+{chips.length - 5} more</li>}
                    </ul>
                </div>

                <div className="flex items-center gap-2 pt-1 min-h-[40px]">
                    {linkButtons.filter((l) => hasLink(links[l.key])).map(({ key, label, Icon }) => (
                        <a
                            key={key}
                            href={links[key]}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${label} for ${name}`}
                            title={label}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-grey-900 hover:bg-violet-600 hover:text-white transition-colors"
                        >
                            <Icon size={16} />
                        </a>
                    ))}
                    <span className="ml-auto text-sm text-violet-700 dark:text-violet-400 opacity-80 group-hover:opacity-100">View details</span>
                </div>
            </motion.div>
        </motion.article>
    );
});

export default Project;
