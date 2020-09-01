import {useState} from "react";
import {insertIndex, removeIndex, swapIndexes} from "@lindapaiste/array-edit";

/**
 * helper for dealing with an array of items where the order is changeable
 *
 * items can be any type T, but it is preferred to use a simple key such as number or string
 *
 * index 0 is considered to be "down" while higher number are considered to be "up"
 *
 * rather than calling moveUp and moveDown with the item, it makes more sense to call them with the index. whatever
 * component or function is doing the calling will know the current index, and this saves the hook from looking it up.
 */
export interface OrderEdit<T, R = void> {
    insert(item: T, position?: ArrayPosition): R;

    remove(position: ArrayPosition): R;

    moveUp(i: number): R;

    moveDown(i: number): R;

    moveTo(i: number, position: ArrayPosition): R;
}

/**
 * can specify a specific numeric position or use helper strings "first" and "last"
 */
export type ArrayPosition = number | "first" | "last";

/**
 * parse position strings into indexes
 */
export const positionToIndex = (array: any[]) =>
    (position: ArrayPosition): number => {
        switch (position) {
            case "first":
                return 0;
            case "last":
                return array.length - 1;
            default:
                return position;
        }
    };

/**
 * stores items locally
 *
 * as currently coded, will NOT respond to external changes
 */
export default <T>(initialOrder: T[]) => {

    const [order, setOrder] = useState(initialOrder);

    const posIndex = positionToIndex(order);

    const isValidIndex = (i: number): boolean => {
        return i >= 0 && i < order.length;
    }

    /**
     * Helper makes sure that indexes both exist before doing a swap. It can be called with invalid values created by
     * trying to move the first item down or the last up, like (0, 0 - 1), and it won't error out.  Will return true on
     * successful swap or false on no swap made.
     */
    const swap = (i: number, j: number): boolean => {
        if (!isValidIndex(i) || !isValidIndex(j)) {
            return false;
        }
        setOrder(order => swapIndexes(order, i, j));
        return true;
    }


    const insert = (item: T, position: ArrayPosition = "last") => {
        setOrder(order => insertIndex(order, posIndex(position), item));
    };

    const moveUp = (i: number): boolean => {
        return swap(i, i + 1);
    };

    const moveDown = (i: number): boolean => {
        return swap(i, i - 1);
    };

    const moveTo = (i: number, position: ArrayPosition): boolean => {
        return swap(i, posIndex(position));
    };

    const remove = (i: number) => {
        setOrder(order => removeIndex(order, i));
    }

    return {
        insert,
        remove,
        moveUp,
        moveDown,
        moveTo,
        order
    }
}
