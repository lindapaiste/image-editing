import {ImageState} from "../free/types";
import {useState} from "react";
import useKeyGen from "./useKeyGen";
import {IPoint, IPointName, Rectangle, shiftBy} from "@lindapaiste/geometry";

/**
 * share the storage of image data between masked collage and free collage
 */

export interface Returns {
    /**
     * data for each image, keyed by the image key
     */
    images: Record<number, ImageState>;

    /**
     * method to add a new image
     * returns the image's key
     */
    addImage(state: NewImageState): number;

    /**
     * helper to update certain properties of an image
     * returns the updated version
     */
    updateImage(key: number, changedProperties: Partial<ImageState>): ImageState;

    /**
     * the entire object of the currently selected image, if there is one
     */
    selected: ImageState | null;

    /**
     * method to select an image by its key
     */
    selectImage(key: number): void;

    /**
     * method to deselect an image by its key
     * returns true if deselected, or false if this key was not the selected key
     */
    deselectImage(key: number): boolean;

    /**
     * method to have no image be selected
     * returns true if an image was deselected, or false if there was already no selection
     */
    deselect(): boolean;

    /**
     * apply a movement to an image's position
     */
    moveImage( key: number, move: IPoint): void;

    /**
     * change the scale, and possibly change the x and y while doing so
     */
    scaleFromPoint(key: number, scale: number, point?: IPointName): void;

    /**
     * rather than setting scale to an amount, can adjust the existing scale by a multiplier
     */
}

/**
 * adding a new image requires that original be set, but scale, x, and y are optional
 * will default to scale = 1, x = 0, y = 0
 */
export type NewImageState = Partial<Omit<ImageState, 'key'>> & Pick<ImageState, 'original'>;

export default (): Returns => {
    /**
     * data for each image, keyed by the image key
     */
    const [images, setImages] = useState<Record<number, ImageState>>({});

    /**
     * the key of the currently active image
     */
    const [selected, setSelected] = useState<number | null >( null );

    /**
     * get unique numeric keys for each image
     */
    const makeKey = useKeyGen();

    /**
     * apply defaults to any values which are not already set
     */
    const newImageState = (partial: NewImageState): ImageState => {
        return {
            scale: 1,
            x: 0,
            y: 0,
            ...partial,
            key: makeKey(),
        }
    }

    /**
     * adds a new image and also selects it
     */
    const addImage = (partial: NewImageState): number => {
        const state = newImageState(partial);
        setImages(prev => ({
            ...prev,
            [state.key]: state,
        }));
        selectImage(state.key);
        return state.key;
    }

    /**
     * helper to update certain properties of an image
     */
    const updateImage = (key: number, changedProperties: Partial<ImageState>): ImageState => {
        const newState = {
            ...images[key],
            ...changedProperties,
        };
        setImages(prevState => ({
            ...prevState,
            [key]: newState
        }));
        return newState;
    }

    /**
     * method to select an image by its key
     */
    const selectImage = (key: number): void => {
        setSelected(key);
    }

    /**
     * method to deselect an image by its key
     * returns true if deselected, or false if this key was not the selected key
     */
    const deselectImage = (key: number): boolean => {
        if( selected === key ) {
            setSelected(null);
            return true;
        } else {
            return false;
        }
    }

    /**
     * method to have no image be selected
     * returns true if an image was deselected, or false if there was already no selection
     */
    const deselect = (): boolean => {
        if ( selected === null ) {
            return false;
        } else {
            setSelected(null);
            return true;
        }
    }

    /**
     * apply a movement to an image's position
     */
    const moveImage = ( key: number, move: IPoint): void => {
        const current = images[key];
        updateImage(key, shiftBy(current, move));
    }

    /**
     * when changing the scale, may also want to change the x and y
     */
    const scaleFromPoint = (key: number, scale: number, point?: IPointName) => {
        const current = images[key];
        const rectangle = new Rectangle({
            x: current.x,
            y: current.y,
            width: current.original.width * current.scale,
            height: current.original.height * current.scale,
        });
        /**
         * get the x and y from the scaled version of the rectangle
         * don't need the width and height because it is derived from the original size and the new scale
         */
        const {x, y} = rectangle.scale(scale, point);
        updateImage(key, {x, y, scale});
    }

    return {
        addImage,
        updateImage,
        images,
        selectImage,
        deselect,
        deselectImage,
        selected: selected ? images[selected] : null,
        moveImage,
        scaleFromPoint,
    }
}
