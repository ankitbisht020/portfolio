import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FaGithub, FaVideo } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { hasLink, splitStack } from "@/lib/site";

const linkButtons = [
    { key: 'visit', label: 'Live site', Icon: BiLinkExternal },
    { key: 'code', label: 'Source code', Icon: FaGithub },
    { key: 'video', label: 'Demo video', Icon: FaVideo },
];

// Optional "desc" on a project can be a string or an array of bullet strings.
const toBullets = (desc) => (Array.isArray(desc) ? desc : typeof desc === 'string' && desc.trim() ? [desc] : []);

const ProjectModal = ({ project, onClose }) => {
    const closeRef = useRef(null);
    const { name, image, category, techstack, links = {}, desc } = project;
    const bullets = toBullets(desc);
    const available = linkButtons.filter((l) => hasLink(links[l.key]));

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto bg-white dark:bg-grey-800 rounded-t-2xl sm:rounded-2xl"
            >
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close project details"
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                    <CgClose size={18} />
                </button>

                {image && (
                    <Image alt={name} width={1280} height={720} sizes="(min-width: 640px) 672px, 100vw" className="w-full h-56 md:h-80 object-cover object-top" src={image} />
                )}

                <div className="p-5 md:p-7 flex flex-col gap-4">
                    <div>
                        <span className="text-xs text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded px-2 py-1 capitalize">{category}</span>
                        <h3 id="project-modal-title" className="text-2xl md:text-3xl font-semibold mt-3">{name}</h3>
                    </div>

                    {bullets.length > 0 && (
                        <ul className="list-disc ml-5 text-sm md:text-base text-gray-600 dark:text-gray-300 space-y-1.5">
                            {bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                    )}

                    <div>
                        <p className="text-sm font-medium mb-2">Built with</p>
                        <ul className="flex flex-wrap gap-2">
                            {splitStack(techstack).map((t) => (
                                <li key={t} className="text-sm bg-gray-100 dark:bg-grey-900 rounded-md px-2.5 py-1">{t}</li>
                            ))}
                        </ul>
                    </div>

                    {available.length > 0 ? (
                        <div className="flex flex-wrap gap-3 pt-1">
                            {available.map(({ key, label, Icon }) => (
                                <a
                                    key={key}
                                    href={links[key]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-2 text-sm py-2 px-4 rounded-md transition-colors ${key === 'visit' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-gray-100 dark:bg-grey-900 hover:bg-violet-100 dark:hover:bg-violet-900/30'}`}
                                >
                                    <Icon /> {label}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is a private or client project, so there is no public link. Happy to walk through it on a call.
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectModal;
