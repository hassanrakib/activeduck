import { FaCheck } from "react-icons/fa";
import signupCSS from "./Signup.module.css";
import { useEffect, useRef, useState } from "react";

const Signup = () => {

  const [steps, setSteps] = useState(null);
  let currentPage = 1;

  // move the first page and get to other pages
  const firstPageRef = useRef(null);
  let marginLeft = 0;
  const handlePageMove = (isNextPage) => {
    if (isNextPage) {
      marginLeft -= 33.33;
      steps[currentPage - 1].classList.add(signupCSS.active);
      currentPage += 1;
    } else {
      marginLeft += 33.33;
      steps[currentPage - 2].classList.remove(signupCSS.active);
      currentPage -= 1;
    }
    firstPageRef.current.style.marginLeft = marginLeft.toString() + "%";
  };

  useEffect(() => {
    const steps = document.querySelectorAll(`.${signupCSS.step}`);
    setSteps(steps);
  }, []);

  return (
    <div className={signupCSS.containerWrapper}>
      <div className={signupCSS.container}>
        <header className={signupCSS.containerHeader}>Sign up</header>
        <div className={signupCSS.progressBar}>
          <div className={signupCSS.step}>
            <p className={signupCSS.stepName}>Name</p>
            <div className={signupCSS.bullet}>
              <span className={signupCSS.bulletNumber}>1</span>
            </div>
            <FaCheck className={signupCSS.check} />
          </div>
          <div className={signupCSS.step}>
            <p className={signupCSS.stepName}>Email</p>
            <div className={signupCSS.bullet}>
              <span className={signupCSS.bulletNumber}>2</span>
            </div>
            <FaCheck className={signupCSS.check} />
          </div>
          <div className={signupCSS.step}>
            <p className={signupCSS.stepName}>Password</p>
            <div className={signupCSS.bullet}>
              <span className={signupCSS.bulletNumber}>3</span>
            </div>
            <FaCheck className={signupCSS.check} />
          </div>
        </div>
        <div className={signupCSS.formOuter}>
          <form className={signupCSS.form}>
            <div className={signupCSS.page} ref={firstPageRef}>
              <div className={signupCSS.field}>
                <input
                  className={signupCSS.inputField}
                  type="text"
                  name="name"
                  placeholder="John Abraham"
                />
              </div>
              <div className={signupCSS.field}>
                <button
                  type="button"
                  className={signupCSS.btn}
                  onClick={() => {
                    handlePageMove(true);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
            <div className={signupCSS.page}>
              <div className={signupCSS.field}>
                <input
                  className={signupCSS.inputField}
                  type="email"
                  name="email"
                  placeholder="john@zitbo.com"
                />
              </div>
              <div className={signupCSS.field}>
                <button type='button' className={`${signupCSS.btn} ${signupCSS.prev}`} onClick={() => {
                  handlePageMove(false);
                }}>
                  Previous
                </button>
                <button
                  type="button"
                  className={`${signupCSS.btn} ${signupCSS.next}`}
                  onClick={() => handlePageMove(true)}
                >
                  Next
                </button>
              </div>
            </div>
            <div className={signupCSS.page}>
              <div className={signupCSS.field}>
                <input
                  className={signupCSS.inputField}
                  type="password"
                  name="password"
                  placeholder="$ecretpassw@rd"
                />
              </div>
              <div className={signupCSS.field}>
                <button type='button' className={`${signupCSS.btn} ${signupCSS.prev}`} onClick={() => {
                  handlePageMove(false);
                }}>
                  Previous
                </button>
                <button className={signupCSS.btn} type="submit">
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
