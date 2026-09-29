'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';

import { FiSun, FiMoon, FiCommand, FiSearch } from 'react-icons/fi';
import { FaNodeJs } from 'react-icons/fa';
import { CgClose, CgMenuRight } from 'react-icons/cg';

const navs = ['home', 'about', 'projects', 'experience', 'contact'];

const openCommandPalette = () => window.dispatchEvent(new Event('open-command-palette'));

export default function Header({ logo }) {
  const [navCollapse, setNavCollapse] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const updateScroll = () => setScroll(window.scrollY >= 90);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const logoMark = logo === 'Ankit Bisht'
    ? <FaNodeJs size={28} aria-label={logo} />
    : <span className="text-lg font-medium">{logo.split(' ')[0]}</span>;

  return (
    <header
      className={`backdrop-filter backdrop-blur-lg ${
        scroll ? 'border-b bg-white bg-opacity-40' : 'border-b-0'
      } dark:bg-grey-900 dark:bg-opacity-40 border-gray-200 dark:border-b-0 z-30 min-w-full flex flex-col fixed`}
    >
      <nav className="lg:w-11/12 2xl:w-4/5 w-full md:px-6 2xl:px-0 mx-auto py-4 hidden sm:flex items-center justify-between">
        <Link
          href={'/'}
          className="2xl:ml-6 hover:text-violet-700 hover:dark:text-violet-500 transition-colors duration-300"
        >
          {logoMark}
        </Link>

        <ul className="flex items-center gap-8">
          {navs.map((e) => (
            <li key={e}>
              <ScrollLink
                className="hover:text-violet-700 hover:dark:text-violet-500 transition-colors capitalize cursor-pointer"
                activeClass="!text-violet-600 font-medium"
                to={e}
                spy={true}
                offset={-60}
                smooth={true}
                duration={500}
                isDynamic={true}
              >
                {e}
              </ScrollLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command menu"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-grey-800 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-400 rounded-md py-1 pl-2 pr-1.5 transition-colors"
            >
              <FiSearch />
              <span>Search</span>
              <kbd className="flex items-center gap-0.5 text-xs bg-gray-100 dark:bg-grey-800 rounded px-1.5 py-0.5">
                {isMac ? <FiCommand size={11} /> : 'Ctrl'} K
              </kbd>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="hover:bg-gray-100 hover:dark:bg-violet-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              {resolvedTheme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </li>
        </ul>
      </nav>

      <nav className="p-4 flex sm:hidden items-center justify-between">
        {logoMark}
        <div className="flex items-center gap-4">
          <button type="button" onClick={openCommandPalette} aria-label="Open command menu">
            <FiSearch size={19} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="bg-gray-100 dark:bg-violet-700 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            {resolvedTheme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button type="button" onClick={() => setNavCollapse(false)} aria-label="Open menu">
            <CgMenuRight size={20} />
          </button>
        </div>
      </nav>

      <div
        className={`flex min-h-screen w-screen absolute md:hidden top-0 ${
          !navCollapse ? 'right-0' : 'right-[-100%]'
        } bottom-0 z-50 ease-in duration-300`}
      >
        <div className="w-1/4" onClick={() => setNavCollapse(true)}></div>

        <div className="flex flex-col p-4 gap-5 bg-gray-100/95 backdrop-filter backdrop-blur-sm dark:bg-grey-900/95 w-3/4">
          <button type="button" className="self-end my-2" onClick={() => setNavCollapse(true)} aria-label="Close menu">
            <CgClose size={20} />
          </button>

          {navs.slice(0, 4).map((e) => (
            <ScrollLink
              key={e}
              className="hover:text-purple-600 py-1.5 px-4 rounded transition-colors capitalize cursor-pointer"
              activeClass="!text-violet-600 font-medium"
              to={e}
              spy={true}
              offset={-60}
              smooth={true}
              duration={500}
              isDynamic={true}
              onClick={() => setNavCollapse(true)}
            >
              {e}
            </ScrollLink>
          ))}
          <ScrollLink
            to="terminal"
            offset={-60}
            smooth={true}
            duration={500}
            onClick={() => setNavCollapse(true)}
            className="hover:text-purple-600 py-1.5 px-4 rounded transition-colors cursor-pointer"
          >
            Terminal
          </ScrollLink>
          <ScrollLink
            to="contact"
            offset={-60}
            smooth={true}
            duration={500}
            onClick={() => setNavCollapse(true)}
            className="px-6 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-center"
          >
            Contact
          </ScrollLink>
        </div>
      </div>
    </header>
  );
}
