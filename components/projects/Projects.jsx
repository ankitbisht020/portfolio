import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const ALL = 'All';
const PAGE_SIZE = 6;

const Projects = ({ projectsData }) => {

    // Newest projects are added at the end of the array, so show them first.
    const projects = useMemo(() => [...projectsData].reverse(), [projectsData]);
    const categories = useMemo(() => [ALL, ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
    const [category, setCategory] = useState(ALL);
    const [viewAll, setViewAll] = useState(false);
    const [active, setActive] = useState(null);

    const filteredProjects = category === ALL
        ? projects
        : projects.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    const visible = filteredProjects.slice(0, viewAll ? filteredProjects.length : PAGE_SIZE);

    const filterProjects = (cat) => {
        setViewAll(false);
        setCategory(cat);
    };

    const close = useCallback(() => setActive(null), []);

    // The command menu can ask for a specific project to be opened.
    useEffect(() => {
        const onOpenProject = (e) => {
            const match = projects.find((p) => p.name === e.detail);
            if (match) setActive(match);
        };
        window.addEventListener('open-project', onOpenProject);
        return () => window.removeEventListener('open-project', onOpenProject);
    }, [projects]);

    return (
        <SectionWrapper id="projects" className="mx-4 md:mx-0 min-h-screen">
            <h2 className="text-4xl text-center">Projects</h2>

            <div role="tablist" aria-label="Filter projects" className="overflow-x-auto scroll-hide md:w-full max-w-screen-sm mx-auto mt-6 flex justify-between items-center gap-2 md:gap-3 bg-white dark:bg-grey-800 p-2 rounded-md">
                {categories.map((c) => (
                    <button
                        key={c}
                        type="button"
                        role="tab"
                        aria-selected={category === c}
                        onClick={() => filterProjects(c)}
                        className={`relative p-1.5 md:p-2 w-full text-sm md:text-base text-center capitalize rounded-md whitespace-nowrap ${category === c ? "text-white" : "hover:bg-gray-100 hover:dark:bg-grey-900"} transition-colors`}
                    >
                        {category === c && (
                            <motion.span layoutId="project-tab" className="absolute inset-0 bg-violet-600 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                        )}
                        <span className="relative">{c}</span>
                    </button>
                ))}
            </div>

            <motion.div layout className="md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4 my-4 md:my-8 mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10">
                <AnimatePresence mode="popLayout">
                    {visible.map((p) => (
                        <ProjectCard key={`${p.name}-${p.category}`} project={p} onOpen={() => setActive(p)} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length > PAGE_SIZE &&
                <ViewAll scrollTo='projects' title={viewAll ? 'Okay, I got it' : 'View All'} handleClick={() => setViewAll(!viewAll)} />
            }

            <AnimatePresence>
                {active && <ProjectModal key={active.name} project={active} onClose={close} />}
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default Projects;

 export const ViewAll = ({ handleClick, title, scrollTo }) => {
    return (
        <>
            <div className="bg-white dark:bg-grey-900 w-4/5 mx-auto blur-xl z-20 -translate-y-14 h-16"></div>
            <div className="text-center -translate-y-24">
                {title === 'View All' ?
                    <button onClick={handleClick} className="bg-violet-600 text-white px-4 py-1.5 rounded-md hover:shadow-xl transition-all">
                        {title}
                    </button>
                    :
                    <Link
                        to={scrollTo}
                        className="bg-violet-600 text-white px-4 cursor-pointer py-1.5 rounded-md hover:shadow-xl transition-all"
                        offset={-60}
                        smooth={true}
                        duration={500}
                        onClick={() => handleClick()}
                    >
                        {title}
                    </Link>
                }
            </div>
        </>
    );
};
