import React from 'react';
import Link from 'next/link';
import { socialIcon } from '@/lib/socialIcons';

const Socials = ({ socials }) => {

    return (
        <section id='socials' className="fixed xl:bottom-4 xl:left-4 2xl:bottom-10 2xl:left-10 hidden lg:flex flex-col gap-3 z-20">
            {socials.map((s) => {
                return (
                    <Link href={s.link} target="_blank" rel="noreferrer" key={s.icon} aria-label={s.icon.replace(/^Fa/, "")} className="grid place-items-center p-3 hover:animate-bounce rounded-full bg-violet-700 text-white">
                        {
                            React.createElement(socialIcon(s.icon))
                        }
                    </Link>
                )
            })}
        </section>
    )
}

export default Socials;
