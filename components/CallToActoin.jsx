import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { BiLinkExternal } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import SectionWrapper from "./SectionWrapper";
import { hasLink } from "@/lib/site";

// Recruiter-facing call to action (replaces the template's "fork this portfolio" banner).
const CallToAction = ({ about = {}, titles = [] }) => {
  const role = about.title || "Developer";

  return (
    <SectionWrapper
      id="cta"
      className="xl:max-w-6xl my-24 lg:mx-10 xl:mx-auto mx-4 relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-10 items-center bg-gradient-to-r from-violet-700 to-purple-700 text-white rounded-2xl p-6 md:p-8 lg:px-12 lg:py-16 z-10"
    >
      <div className="flex flex-col md:w-1/2 lg:w-3/5">
        <h2 className="text-2xl lg:text-4xl font-extrabold">
          Have a backend or AI project in mind?
        </h2>
        <p className="text-sm md:text-base mt-3 md:mt-5 text-violet-100 max-w-lg">
          I design APIs, real-time systems and AI features that hold up in production. Tell me what you are building and I will get back to you.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <ScrollLink
            to="contact"
            offset={-60}
            smooth={true}
            duration={500}
            className="cursor-pointer py-2 px-4 bg-white text-black rounded-lg w-fit flex items-center gap-2 hover:shadow-xl transition-shadow"
          >
            <FiSend />
            Start a conversation
          </ScrollLink>
          {hasLink(about.resumeUrl) && (
            <Link
              href={about.resumeUrl}
              target="_blank"
              className="py-2 px-4 bg-violet-800 rounded-lg w-fit flex items-center gap-2 hover:bg-violet-900 transition-all"
            >
              View resume
              <BiLinkExternal />
            </Link>
          )}
        </div>
      </div>

      <pre
        aria-hidden="true"
        className="w-full md:w-1/2 lg:w-2/5 rounded-xl bg-grey-900/90 text-[13px] leading-relaxed p-5 font-mono text-gray-200 overflow-x-auto shadow-2xl"
      >
<span className="text-violet-400">const</span> <span className="text-sky-300">engineer</span> = {"{"}{"\n"}
{"  "}role: <span className="text-emerald-300">&quot;{role}&quot;</span>,{"\n"}
{"  "}focus: [{"\n"}
{titles.slice(0, 4).map((t, i) => (
  <span key={t}>{"    "}<span className="text-emerald-300">&quot;{t}&quot;</span>{i < Math.min(titles.length, 4) - 1 ? "," : ""}{"\n"}</span>
))}
{"  "}],{"\n"}
{"  "}ships: <span className="text-amber-300">true</span>,{"\n"}
{"}"};
      </pre>
    </SectionWrapper>
  );
};

export default CallToAction;
