import { useState, useEffect, useRef } from "react";
import { Loader } from "../Loader";
import Portal from "../Portal";
import styles from './Modal.module.css';

function Modal (props) {
    const [active, setActive] = useState(false);
    // get spread props out variables
    const { open, onClose, locked } = props;
    // Make a reference to the backdrop
    const backdrop = useRef(null);
    
    // on mount
    useEffect(() => {
        // get dom element from backdrop
        const { current } = backdrop;
        // when transition ends set active state to match open prop
        const transitionEnd = () => setActive(open);
        // when esc key press close modal unless locked
        const keyHandler = e => !locked && [27].indexOf(e.which) >= 0 && onClose();
        // when clicking the backdrop close modal unless locked
        const clickHandler = e => !locked && e.target === current && onClose();
        
        // if the backdrop exists set up listeners
        if (current) {
            current.addEventListener("transitionend", transitionEnd);
            current.addEventListener("click", clickHandler);
            window.addEventListener("keyup", keyHandler);
        }
        
        // if open props is true add inert to #root
        // and set active state to true
        if (open) {
            window.setTimeout(() => {
                document.activeElement.blur();
                setActive(open);
                document.querySelector("#root").setAttribute("inert", "true");
            }, 10);
        }
        
        // on unmount remove listeners
        return () => {
            if (current) {
                current.removeEventListener("transitionend", transitionEnd);
                current.removeEventListener("click", clickHandler);
            }
            
            document.querySelector("#root").removeAttribute("inert");
            window.removeEventListener("keyup", keyHandler);
        };
    }, [open, locked, onClose]);

    return (
        <>
          {(open || active) && (
            <Portal className={styles.modalPortal}>
              <div ref={backdrop} className={active && open ? `${styles.modalBackdrop} ${styles.modalActive}` : styles.modalBackdrop}>
                {props.dataLoaded ?
                    <div className={styles.modalContent}>{props.children}</div>
                    :
                    <Loader />
                }
              </div>
            </Portal>
          )}
        </>
      );
}

export default Modal;