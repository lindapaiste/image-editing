import {BoxMouseEvent, ControlledRectangleReturns, MouseControlsReturns, Settings} from "./types";
import {useEffect, useState} from "react";
import {IRectanglePoint} from "@lindapaiste/geometry";

/**
 * click on a point to stretch or scale that point
 * click anywhere inside the rectangle to pick it up and drag it
 *
 * move end is triggered through a global window listener
 * but move start is called through click events on the specific components
 * need to return that callback from this hook
 *
 * drag move isn't actually a drag as the mouse doesn't need to be held down,
 * it's a toggled click on/off state
 */
export const useMouseControls = (props: ControlledRectangleReturns & Settings): MouseControlsReturns => {

    /**
     * will be null if moving or doing nothing
     * will be a Rectangle Point if dragging that point
     */
    const [activePoint, setActivePoint] = useState<IRectanglePoint | null>(null);

    /**
     * save the position where the mouse move started in order to see how much it has changed
     */
    const [mouseStart, setMouseStart] = useState<BoxMouseEvent | null>(null);

    /**
     * rather than having separate event listeners, can know whether it's a move or a resize
     * based on whether an activePoint has been set
     */
    const isResizing = props.isDragging && activePoint !== null;
    const isMoving = props.isDragging && activePoint === null;


    /**
     * can conditionally add and remove mousemove handler,
     * or can have it always present but do nothing if not dragging
     * I think it is better to only attach when it's actually needed
     *
     * click handler is active when awaiting an end click
     */
    useEffect(() => {
        const addListeners = () => {
            window.addEventListener('mousedown', handleClick);
            window.addEventListener('mousemove', handleMouseMove);
        }

        const removerListeners = () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('mousemove', handleMouseMove);
        }

        /**
         * add or remove based on "isDragging"
         */
        if ( props.isDragging ) {
            addListeners();
        } else {
            removerListeners();
        }

        /**
         * cleanup on unmount
         */
        return () => removerListeners();
    },
        [props.isDragging]
    );

    /**
     * click to enter or leave the move state
     */
    const handleClick = (e: BoxMouseEvent, point?: IRectanglePoint): void => {
        console.log('isDragging?');
        console.log(props.isDragging);
        if (props.isDragging) {
            endEvent();
        } else {
            beginEvent(e, point);
        }
    };

    /**
     * ends dragging, clears local states, and removes mousemove listener
     */
    const endEvent = () => {
        console.log('Mouse Up');
        props.endDrag();
        setMouseStart(null);
        setActivePoint(null);
        //window.removeEventListener('mousemove', handleMouseMove);
    };

    const beginEvent = (e: BoxMouseEvent, point?: IRectanglePoint): void => {
        if (!props.isDragging) {
            /**
             * begin the drag and store the start position
             */
            setMouseStart(e);
            props.startDrag();
            /**
             * begins a resize if clicking on a rectangle point while resizable
             */
            if (point && props.resizable) {
                setActivePoint(point);
            }
            /**
             * other clicks begin a move, including clicking a rectangle point if not resizable
             */
            else if (props.movable) {
                setActivePoint(null); //just in case, should already be cleared
            }
            /**
             * both situations require the same listener
             */
            //console.log('adding listeners');
            //window.addEventListener('mousemove', handleMouseMove);
        }
    }

    const handleMouseMove = (e: BoxMouseEvent) => {
        /**
         * mouseStart must be set in order to calculate a change
         */
        if (!props.isDragging || mouseStart === null) {
            return;
        }

        /**
         * both move and resize actions need to know how much the mouse has moved since the click
         */
        console.log('Mouse Move');
        console.log(e);
        const changeX = e.pageX - mouseStart.pageX;
        const changeY = e.pageY - mouseStart.pageY;
        console.log({changeX, changeY});

        //MOVING
        if (isMoving) {
            /**
             * shift by the change amount
             */
            props.shift(changeX, changeY);
        }

        //RESIZING
        if (activePoint !== null) {
            /**
             * the most error-proof way to find the x and y values of the point
             * in the same coordinate plane as the original is to apply the change to the start values
             */
            const current = {
                ...activePoint,
                x: activePoint.x + changeX,
                y: activePoint.y + changeY,
            };

            /**
             * resize logic is handled higher up
             * just pass the point to the appropriate function
             */
            if (props.fixedRatio) {
                props.scaleToPoint(current);
            } else {
                props.stretchToPoint(current);
            }
        }
    }

    return {
        onPress: handleClick,
        activePoint,
    }
}
