/**
 * images can go anywhere in a free moving collage, as long as some part of the image is still visible on the canvas
 *
 * order matters because images might overlap
 */

export interface State {
    /**
     * data for each image, keyed by the image key
     */
    images: Record<number, ImageState>;
    /**
     * an array containing the order of the keys
     */
    layers: number[];
    /**
     * the key of the currently selected image, if any
     */
    selected?: number;
}

/**
 * each image stores its current position and current scale, along with the original size and src
 * include the key here too, though not necessary as it is indexed by key
 */
export interface ImageState {
    original: SizedImage;
    scale: number;
    x: number;
    y: number;
    key: number;
}

export interface SizedImage {
    width: number;
    height: number;
    source_url: string;
}
