import {useRef} from "react";

/**
 * hook returns a function that gives a unique number when called, incrementing from 1 without repetition
 */
type Returns = () => number;

export default (): Returns => {
    /**
     * note: the primary difference between useRef and useState is that updates to useState trigger a re-render, while
     * useRef does not.  either works here.
     */
    const keyRef = useRef(0);

    /**
     * on function call, return a key and also increment the ref
     */
    return (): number => {
        const key = keyRef.current + 1;
        keyRef.current = key;
        return key;
    }
}
