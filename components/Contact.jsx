import { useState } from "react";
import { useTheme } from "next-themes";
import { BiLoaderAlt } from "react-icons/bi";
import { FiCopy, FiMail, FiPhone } from "react-icons/fi";
import SectionWrapper from "./SectionWrapper";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import emailjs from "emailjs-com"; 
import 'react-toastify/dist/ReactToastify.css';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";
import { copyText } from "@/lib/scroll";

// EmailJS keys: set these in Vercel → Settings → Environment Variables.
// The fallbacks keep the current behaviour working until you do.
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_ov8o4ad';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_g5os26u';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'wMX7YdNbKjzQHUZGt';
// Optional second template that emails the visitor a "we got your message" reply.
const EMAILJS_AUTOREPLY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID ||'template_xuejucc' ;

const Contact = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const { resolvedTheme } = useTheme();

    const copyEmail = async () => {
        (await copyText(CONTACT_EMAIL)) ? toast.success("Email copied!") : toast.info(CONTACT_EMAIL);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, message } = values;

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.warning("Empty Fields!");
            return;
        }

        setLoading(true);

        const params = { from_name: name, from_email: email, message };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY)
            .then(() => {
                // Best effort: a failed auto-reply must not turn a delivered message into an error.
                if (EMAILJS_AUTOREPLY_TEMPLATE_ID) {
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY)
                        .catch((error) => console.error("Auto-reply failed:", error));
                }
                setValues({ name: "", email: "", message: "" });
                setLoading(false);
                toast.success("Message sent successfully!");
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                toast.error("Failed to send message.");
            });
    };

    const handleChange = (e) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <SectionWrapper id="contact" className="mb-16 mx-4 lg:mx-0">
            <h2 className="text-center text-4xl">Contact Me</h2>
            <ToastContainer position="bottom-center" theme={resolvedTheme === "dark" ? "dark" : "light"} />

            <div className="w-full lg:w-5/6 2xl:w-3/4 mt-10 md:mt-16 mx-auto flex justify-between rounded-xl">
                <Image unoptimized={true} quality={100} alt="contact" src="/contact.png" className="hidden md:block w-1/2 h-full object-cover" width={1000} height={1000} />
                <div className="flex-1">
                    <h3 className="text-2xl">Get in touch</h3>
                    <p className="text-gray-400 mb-4 text-sm md:text-base">My inbox is always open! 💌 Whether you've got a burning question or want to drop a friendly "hello", I'm all ears!👂 Let's chat! 🎉</p>

                    <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-100 dark:bg-grey-800 hover:text-violet-700 dark:hover:text-violet-400 transition-colors">
                            <FiMail /> {CONTACT_EMAIL}
                        </a>
                        <button type="button" onClick={copyEmail} aria-label="Copy email address" className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-grey-800 hover:border-violet-400 transition-colors">
                            <FiCopy /> Copy
                        </button>
                        <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-100 dark:bg-grey-800 hover:text-violet-700 dark:hover:text-violet-400 transition-colors">
                            <FiPhone /> {CONTACT_PHONE}
                        </a>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl">
                        <input onChange={handleChange} value={values.name} name="name" aria-label="Full name" type="text" placeholder='Full Name *' className="outline-none focus:ring-2 focus:ring-violet-500 bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
                        <input onChange={handleChange} value={values.email} name="email" aria-label="Email" type="email" placeholder='Email *' className="outline-none focus:ring-2 focus:ring-violet-500 bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
                        <textarea onChange={handleChange} value={values.message} name="message" aria-label="Message" rows={4} placeholder='Message *' className="outline-none resize-none focus:ring-2 focus:ring-violet-500 bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
                        <button disabled={loading} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 transition-colors text-white rounded-lg disabled:cursor-not-allowed self-end">
                            {loading ? <span className="flex items-center gap-2">Sending <BiLoaderAlt className="animate-spin" /></span> : "Say Hello 👋"}
                        </button>
                    </form>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Contact;
