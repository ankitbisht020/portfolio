import { motion, useScroll, useSpring } from 'framer-motion';

// Thin reading-progress bar pinned to the top of the viewport.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-violet-600 z-[60]"
    />
  );
};

export default ScrollProgress;
