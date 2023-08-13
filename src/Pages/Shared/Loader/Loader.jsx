import { loader } from "./Loader.module.css";

// by default loader width and height set to 80px
const Loader = ({width = "80px", height = "80px"}) => {
  return <div style={{width, height}} className={loader}></div>;
};

export default Loader;
