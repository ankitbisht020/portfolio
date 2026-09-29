import {
  FaLinkedin, FaLinkedinIn, FaGithub, FaInstagram, FaTwitter, FaYoutube, FaMedium, FaDev,
  FaFacebook, FaDiscord, FaTelegram, FaWhatsapp, FaStackOverflow, FaBehance, FaDribbble, FaEnvelope, FaLink,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Only the icons the "socials" list can use. Importing `* as Fa` pulled the entire
// Font Awesome set (hundreds of KB) into the page bundle.
const ICONS = {
  FaLinkedin, FaLinkedinIn, FaGithub, FaInstagram, FaTwitter, FaXTwitter, FaYoutube, FaMedium, FaDev,
  FaFacebook, FaDiscord, FaTelegram, FaWhatsapp, FaStackOverflow, FaBehance, FaDribbble, FaEnvelope,
};

export const socialIcon = (name) => ICONS[name] || FaLink;
