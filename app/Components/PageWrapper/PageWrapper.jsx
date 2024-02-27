"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const PageWrapper = ( { children } ) => {

  let route = usePathname();

  let variants = {
    hidden: {
      opacity: 0,
      y: -10,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    visible: {
      opacity: 1,
      y: 0,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    exit: {
      y: 5,
      opacity: 0,
      // clipPath: "polygon(50% 0, 50% 0, 49% 100%, 49% 100%)"
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* <motion.main
        key={ route }
        variants={ variants }
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={ {
          duration: .5,
        } }
      > */}
      { children }
      {/* </motion.main> */ }
    </AnimatePresence>
  );
};

export default PageWrapper;