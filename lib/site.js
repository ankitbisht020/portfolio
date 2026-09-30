// Contact email used by the contact section, terminal and command menu.
// Set NEXT_PUBLIC_CONTACT_EMAIL in Vercel to change it without touching code.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'ankitbisht9837@gmail.com';

// Phone number shown in the contact section, terminal and command menu.
// Set NEXT_PUBLIC_CONTACT_PHONE in Vercel to change it without touching code.
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91-9368469905';
export const CONTACT_PHONE_HREF = `tel:${CONTACT_PHONE.replace(/[^\d+]/g, '')}`;

const SOCIAL_NAMES = {
  FaLinkedin: 'LinkedIn',
  FaLinkedinIn: 'LinkedIn',
  FaGithub: 'GitHub',
  FaInstagram: 'Instagram',
  FaTwitter: 'Twitter / X',
  FaXTwitter: 'X',
  FaYoutube: 'YouTube',
  FaMedium: 'Medium',
  FaDev: 'DEV',
};

export const socialName = (icon = '') => SOCIAL_NAMES[icon] || icon.replace(/^Fa/, '');

export const splitStack = (techstack = '') =>
  techstack.split(',').map((t) => t.trim()).filter(Boolean);

export const hasLink = (value) => typeof value === 'string' && value.trim().length > 0;
