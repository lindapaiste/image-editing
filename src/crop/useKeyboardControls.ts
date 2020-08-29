import React, {useEffect} from "react";
import {ControlledRectangleReturns, Settings} from "./types";

export const useKeyboardControls = (props: ControlledRectangleReturns & Settings): void => {
    /**
     * add a global window listener to respond to keyboard controls
     */
    useEffect(() => {
            window.addEventListener('keydown', handleKeyDown);

            return () => window.removeEventListener('keydown', handleKeyDown);
        },
        []
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        /**
         * arrow keys cause shift by 1px in that direction
         */
        if (props.movable) {
            if (e.key === 'ArrowLeft') {
                props.shiftX(-1);
            } else if (e.key === 'ArrowRight') {
                props.shiftX(1);
            } else if (e.key === 'ArrowUp') {
                props.shiftY(-1);
            } else if (e.key === 'ArrowDown') {
                props.shiftY(1);
            }
        }
        /**
         * keys + and - cause scale from center
         * the amount of the change is determined higher up
         */
        if (props.resizable) {
            if (e.key === '-') {
                props.decreaseScale();
            } else if (e.key === '=' || e.key === '+') {
                props.increaseScale();
            }
        }
        /**
         * ctrl-Z and ctrl-Y cause undo and redo
         */
        if (e.ctrlKey) {
            if (e.key === 'z') {
                props.undo();
            } else if (e.key === 'y') {
                props.redo();
            }
        }
    };

}
