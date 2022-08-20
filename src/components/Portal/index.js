import { useEffect, useMemo } from "react";
import {createPortal} from 'react-dom';

export default function Portal({ children, parent, className }) {
    const el = useMemo(() => document.createElement("div"), []);
    useEffect(() => {
        // work out target in the DOM based on parent prop
        const target = parent && parent.appendChild ? parent : document.body;
        // Default classes
        const classList = ["portal-container"];
        // If className prop is present add each class the classList
        if (className) className.split(" ").forEach((item) => classList.push(item));
        classList.forEach((item) => el.classList.add(item));
        // Append element to dom
        target.appendChild(el);
        // On unmount function
        return () => {
            // Remove element from dom
            target.removeChild(el);
        };
    }, [el, parent, className]);
    // return the createPortal function
    return createPortal(children, el);
}