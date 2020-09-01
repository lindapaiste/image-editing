import {SizedImage} from "./types";
import useOrder from "../layers/useOrder";
import {getScaleToFit} from "@lindapaiste/geometry";
import useImagesArray from "../shared/useImagesArray";

export interface Props {
    /**
     * the size of the collage canvas
     */
    width: number;
    height: number;
    /**
     * an array of images to start with
     */
    images?: SizedImage[];
}

export default ({width, height}: Props) => {

    /**
     * useOrder hook manages layer utilities
     */
    const layers = useOrder<number>([]);

    /**
     * most of the logic comes from the useImagesArray hook, which holds all of the image states, keys, and the current
     * selection
     */
    const state = useImagesArray();

    /**
     * When adding an image, start with position at the center of the canvas and the scale such that it fits inside the
     * canvas. New images become the top layer and they also become selected.
     */
    const addImage = (image: SizedImage): number => {
        const scale = getScaleToFit(image, {width, height});
        const key = state.addImage({
            original: image,
            scale,
            x: .5 * width - .5 * image.width * scale,
            y: .5 * height - .5 * image.height * scale,
        });
        layers.insert(key, 'last');
        return key;
    }

    const generateFile = () => {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        //.....TODO
        let dataURL = canvas.toDataURL('image/png');
    }

    //TODO: drag & constrain move

    return {
        ...state,
        addImage,
        layers,
    }

}
