import { scroller } from 'react-scroll';

// Smooth-scrolls to a section id, leaving room for the fixed header.
export const goTo = (id) => {
  if (typeof document === 'undefined' || !document.getElementById(id)) return;
  scroller.scrollTo(id, { offset: -60, smooth: true, duration: 500 });
};

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
