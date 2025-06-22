import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import SectionWrapper from "./SectionWrapper";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import emailjs from "emailjs-com"; 
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, message } = values;

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.warning("Empty Fields!");
            return;
        }

        setLoading(true);

        emailjs.send(
            'service_ov8o4ad',
            '__ejs-test-mail-service__',       
            {
                from_name: name,
                from_email: email,
                message: message,
            },
            'wMX7YdNbKjzQHUZGt'         
        )
            .then(() => {
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
            <ToastContainer />

            <div className="w-full lg:w-5/6 2xl:w-3/4 mt-10 md:mt-16 mx-auto flex justify-between rounded-xl">
                <Image unoptimized={true} quality={100} alt="contact" src="/contact.png" className="hidden md:block w-1/2 h-full object-cover" width={1000} height={1000} />
                <div className="flex-1">
                    <h3 className="text-2xl">Get in touch</h3>
                    <p className="text-gray-400 mb-4 text-sm md:text-base">My inbox is always open! 💌 Whether you've got a burning question or want to drop a friendly "hello", I'm all ears!👂 Let's chat! 🎉</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl">
                        <input onChange={handleChange} value={values.name} name="name" type="text" placeholder='Full Name *' className="outline-none bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
                        <input onChange={handleChange} value={values.email} name="email" type="email" placeholder='Email *' className="outline-none bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
                        <textarea onChange={handleChange} value={values.message} name="message" rows={4} placeholder='Message *' className="outline-none resize-none bg-gray-100 dark:bg-grey-800 placeholder-gray-400 rounded-lg py-3 px-4" />
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
