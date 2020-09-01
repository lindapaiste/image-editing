import React from "react";
import {Props as CollageProps} from "./types";
import {Returns} from "../shared/useImagesArray";
import {FixedSizeView, RectangleView} from "@lindapaiste/react-native-layout";
import {RenderImage} from "./RenderImage";
import {AddAPhoto} from "@material-ui/icons";

type Props = CollageProps & Returns & {
    /**
     * an array with the same indexes as slots array, containing the key of the image in that slot
     */
    slotKeys: (number | undefined)[];
};

export default ({width, height, slots, slotKeys, images, selectImage, updateImage}: Props) => {

    /**
     * render the image in rectangle slot index i, or an add image button if the slot is empty
     *
     * add image doesn't do anything...yet
     */
    const slotContents = (i: number) => {
        const key = slotKeys[i];
        if (key === undefined) {
            return (
                <AddAPhoto/>
            );
        } else {
            return (
                <RenderImage
                    state={images[key]}
                    setPosition={(pos) => updateImage(key, pos)}
                    select={() => selectImage(key)}
                />
            )
        }
    }

    return (
        <FixedSizeView
            width={width}
            height={height}
            style={{position: "relative"}}
        >
            {slots.map((slot, i) => (
                <RectangleView
                    key={i}
                    {...slot}
                >
                    {slotContents(i)}
                </RectangleView>
            ))}

        </FixedSizeView>
    )
}

