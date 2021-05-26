import {ControlledRectangleProps, ControlledRectangleReturns} from "./types";
import {useHistory} from "../../../../shs-react-redux-app/src/util/history/useHistory";
import {useEffect, useState} from "react";
import {IRectangle, IRectanglePoint, ImmutableRectangle as Rectangle} from "@lindapaiste/geometry";
import BoundedRectangle from "@lindapaiste/geometry/lib/rectangle/BoundedRectangle";

/**
 * can separate the rectangle mutations from the keyboard and mouse events that trigger them
 * so that button or other external controls can also trigger them
 *
 * the logic hooks takes care of checking everything for validity
 */

export const useControlledRectangle = ({initialRectangle, boundaries}: ControlledRectangleProps): ControlledRectangleReturns => {

    /**
     * store the history of all the rectangles its been through
     */
    const history = useHistory<IRectangle>([initialRectangle]);

    /**
     * history shouldn't included states created while dragging
     * need to differentiate between changes which are undoable
     * and those that are just incremental
     */
    const [isDragging, setIsDragging] = useState(false);

    /**
     * rather than updating the current item in history,
     * use a temporary "current" rectangle
     *
     * this is because it is expected that move/scale functions
     * will be called many times during a move, and those functions
     * should act ON THE RECTANGLE WHERE THE DRAG BEGAN rather than
     * on the most recent current version
     */
    const [current, setCurrent] = useState<IRectangle>(initialRectangle);

    /**
     * helper setRectangle updates either the current or the history
     * based on whether it is dragging or not
     */
    const setRectangle = (rect: IRectangle): void => {
        isDragging ? setCurrent(rect) : history.pushState(rect);
    }

    /**
     * classed object of the current rectangle, used to create changed versions
     */
    const bounded = new BoundedRectangle(
        new Rectangle(history.current() || initialRectangle),
        new Rectangle(boundaries)
    );

    /**
     * effect responds to drag toggling on and off by applying changes to history on end
     * and updating an initial value of current on start
     */
    useEffect(() => {
        if (isDragging) {
            setCurrent(history.current() || initialRectangle);
        } else {
            history.pushState(current);
        }
    }, [isDragging]);

    /**
     * returned object maps edit functions through bounded and setRectangle
     */
    return {
        isDragging,
        startDrag(): void {
            setIsDragging(true);
        },
        endDrag(): void {
            setIsDragging(false);
        },
        undo(): void {
            history.back();
        },
        redo(): void {
            history.forward();
        },
        rectangle: current, //isDragging ? current : history.current() || initialRectangle,
        shift(changeX: number, changeY: number): void {
            setRectangle(bounded.shift(changeX, changeY));
        },
        shiftX(change: number): void {
            setRectangle(bounded.shiftX(change));
        },
        shiftY(change: number): void {
            setRectangle(bounded.shiftY(change));
        },
        scale(scale: number): void {
            setRectangle(bounded.scale(scale));
        },
        increaseScale(): void {
            //TODO
        },
        decreaseScale(): void {
        },
        scaleToPoint(point: IRectanglePoint): void {
            setRectangle(bounded.scaleToPoint(point));
        },
        stretchToPoint(point: IRectanglePoint): void {
            setRectangle(bounded.stretchToPoint(point));
        }
    }

}
