import {Settings, ToolLogicProps, ToolLogicReturns} from "./types";
import {useMemo, useState} from "react";
import {useControlledRectangle} from "./useControlledRectangle";
import { ImmutableRectangle } from "@lindapaiste/geometry";
import BoundedRectangle from "@lindapaiste/geometry/lib/rectangle/BoundedRectangle";

export const defaultSettings: Settings = {
    movable: true,
    resizable: true,
    fixedRatio: true,
}

/**
 * stores the settings and info about the image itself
 * the boundaries are based on the the size that the image is displayed
 * this will not be the same as the actual image size if it was shrunk to fit
 *
 * a previous version used the img "onLoad" callback to get the image size after being resized by the DOM,
 * but now it is expected that the image be resized before it is passed in here
 */
export const useCropToolLogic = ({initialAspectRatio, initialSettings, image}: ToolLogicProps): ToolLogicReturns => {

    const [settings, setSettings] = useState({...defaultSettings, ...initialSettings})

    const [isPreview, setIsPreview] = useState(false);

    const boundaries = useMemo(() => new ImmutableRectangle({
        ...image,
        x: 0,
        y: 0,
    }), [image.width, image.height]);

    const initialRectangle = useMemo(() => {
        /**
         * with no aspect ratio, the largest possible initial rectangle is the boundaries itself
         * could return this, but choosing to return a 50% scale instead
         * because the boundaries will be more visible if they are not on the very edge of the image
         *
         * likewise, target a 50% scale with a defined ratio, but need to check for overflows,
         * which are unlikely at a 50% size but could occur if the image ratio is very different from the targeted
         */
        if (!initialAspectRatio) {
            return boundaries.scale(.5);
        } else {
            const bounded = new BoundedRectangle(
                boundaries.scale(.5),
                boundaries,
            );
            return bounded.stretchToRatio(initialAspectRatio);
        }
    }, [initialAspectRatio, boundaries]);


    /**
     * pass off much of the logic to useControlledRectangle
     *
     * note: currently WILL NOT respond to changes in initialRectangle, but I can change this
     * or have it return a "reset" prop when there's a new image
     */
    const rectangleActions = useControlledRectangle({initialRectangle, boundaries});


    const toggleFixedRatio = (): void => {
        setSettings((prev) => ({
            ...prev,
            fixedRatio: !prev.fixedRatio
        }));
    }

    const togglePreview = (): void => {
        setIsPreview(prev => !prev);
    }

    const onPressSave = (): void => {
        //TODO
        console.log("clicked save");
    };

    return {
        ...rectangleActions,
        ...settings,
        isPreview,
        toggleFixedRatio,
        togglePreview,
        onPressSave,
        boundaries,
    }
}
