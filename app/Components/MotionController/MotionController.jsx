import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MotionController = ( { children, className } ) => {

  const [ ref, inView ] = useInView( {
    triggerOnce: false, // Trigger animation only once
    threshold: 0.25, // When 40% of the element is in view
  } );

  const fadeInAnimation = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, },
  };

  return (
    <motion.div
      ref={ ref }
      initial="hidden"
      animate={ inView ? "visible" : "hidden" }
      variants={ fadeInAnimation }
      style={ {
        position: "relative",
      } }
      className={ className }
    >
      { children }
    </motion.div>
  );
};

export default MotionController;