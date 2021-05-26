import {Dimensions} from "react-native";

/**
 * TODO: this is a placeholder!
 *
 * Needs to be a hook.
 *
 * Given a width and height, find the max scale that is contained in the current window.
 */
export const getScale = (width: number, height: number): number => {
    const windowSize = Dimensions.get("window");
    return Math.max( windowSize.width / width, windowSize.height / height );
}
