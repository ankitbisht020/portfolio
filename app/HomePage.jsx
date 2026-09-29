'use client';
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Impact from "@/components/Impact";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Socials from "@/components/Socials";
import Experiences from "@/components/experiences/Experiences";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";
import CallToAction from "@/components/CallToActoin";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "./Footer";

// Client-only pieces (they read the theme, keyboard and window on mount).
const Header = dynamic(() => import("./Header"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });
const AskAI = dynamic(() => import("@/components/AskAI"), { ssr: false });

const HomePage = ({ data, aiEnabled = false }) => {
    return (
        <>
            <ScrollProgress />
            <Header logo={data.main.name} />
            <Hero mainData={data.main} />
            <Socials socials={data.socials || []} />
            <About aboutData={data.about} name={data.main.name} />
            <Impact stats={data.stats} achievements={data.achievements || []} data={data} />
            <Skills skillData={data.skills || []} />
            <Projects projectsData={data.projects || []} />
            <Experiences experienceData={data.experiences || []} educationData={data.educations || []} />
            <Terminal data={data} />
            <CallToAction about={data.about} titles={data.main.titles || []} />
            <Contact />
            <Footer socials={data.socials || []} name={data.main.name} />
            <CommandPalette data={data} aiEnabled={aiEnabled} />
            {aiEnabled && <AskAI name={data.main.name} />}
        </>
    );
};

export default HomePage;
