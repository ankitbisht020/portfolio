import Image from "next/image";
import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { useTheme } from "next-themes";

// Logos that are black/very dark and need inverting in dark mode (compared case-insensitively).
const INVERT_IN_DARK = ['github', 'vercel', 'nextjs', 'next.js', 'expressjs', 'cursor', 'github copilot', 'webrtc', 'socket.io'];

const Skill = ({ name, image }) => {

    const { resolvedTheme } = useTheme();
    const [bgColor, setBgColor] = useState("");
    const invert = resolvedTheme === 'dark' && INVERT_IN_DARK.includes(name?.toLowerCase());

    useEffect(() => {
        new FastAverageColor().getColorAsync(image)
            .then(color => {
                const rgba = color.rgb.split(')');
                setBgColor(rgba[0] + ',0.07)');
            })
            .catch(() => {});
    }, [image]);

    return (
        <div className="group flex flex-col justify-center items-center gap-2">
            <div title={name} style={{ backgroundColor: bgColor }}
                className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-100 dark:bg-grey-800 flex items-center justify-center ring-0 group-hover:ring-2 ring-violet-400/60 group-hover:-translate-y-1 transition-all duration-300">
                <Image alt="" width={100} height={100} className={`h-12 w-12 md:h-14 md:w-14 object-contain group-hover:scale-110 transition-transform duration-300 ${invert ? 'invert' : 'invert-0'}`} src={image} />
            </div>
            <p className="text-sm md:text-base text-center">{name}</p>
        </div>
    );
}

export default Skill;
