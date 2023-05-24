import ProgressBar from "../ProgressBar/ProgressBar";
import {
  containerWrapper,
  container,
  containerHeader,
  formOuter,
  form,
  page,
  field,
  inputField,
  btn,
} from "./Signup.module.css";
import { useState } from "react";

const Signup = () => {
  // ge the current page index
  const [currentPage, setCurrentPage] = useState(1);

  const moveToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div className={containerWrapper}>
      <div className={container}>
        <header className={containerHeader}>Sign up</header>

        {/* progressBar to show progress on the top */}
        <ProgressBar currentPage={currentPage} />
        
        <div className={formOuter}>
          <form className={form}>
            
            {/* move the first page based on currentPage */}
            <div
              className={page}
              style={
                currentPage === 2
                  ? { marginLeft: "-33.33%" }
                  : currentPage === 3
                  ? { marginLeft: "-66.66%" }
                  : null
              }
            >
              <div className={field}>
                <input
                  className={inputField}
                  type="text"
                  name="name"
                  placeholder="John Abraham"
                />
              </div>
              <div className={field}>
                <button
                  type="button"
                  className={btn}
                  onClick={() => {
                    moveToPage(2);
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            {/* second page */}
            <div className={page}>
              <div className={field}>
                <input
                  className={inputField}
                  type="email"
                  name="email"
                  placeholder="john@zitbo.com"
                />
              </div>
              <div className={field}>
                <button
                  type="button"
                  className={btn}
                  onClick={() => {
                    moveToPage(1);
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={btn}
                  onClick={() => moveToPage(3)}
                >
                  Next
                </button>
              </div>
            </div>

            {/* third page */}
            <div className={page}>
              <div className={field}>
                <input
                  className={inputField}
                  type="password"
                  name="password"
                  placeholder="$ecretpassw@rd"
                />
              </div>
              <div className={field}>
                <button
                  type="button"
                  className={btn}
                  onClick={() => {
                    moveToPage(2);
                  }}
                >
                  Previous
                </button>
                <button className={btn} type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
