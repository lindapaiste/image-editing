import {ImageState, State} from "./types";
import {ISized} from "@lindapaiste/geometry";
import React from "react";
import {FixedSizeView, PositionedView, RelativeContainer} from "@lindapaiste/react-native-layout";
import {ScaledImage} from "@lindapaiste/react-native-image-sizing"

export default ({images, layers, selected, width, height}: State & ISized) => {


    //TODO: controls
    //TODO: bounding box on selected

    return (
        <FixedSizeView
            width={width}
            height={height}
        >
            <RelativeContainer>
                {layers.map(key => {
                    const image = images[key];
                    if ( ! image ) {
                        console.error("no image found with key " + key );
                        return null;
                    }
                    return (
                        <RenderImage {...image}/>
                    )
                })}
            </RelativeContainer>
        </FixedSizeView>
    )
}

/**
 * TODO: event handling
 */
export const RenderImage = ({x, y, original, scale}: ImageState) => {
    return (
        <PositionedView
            x={x}
            y={y}
        >
            <ScaledImage
                image={original}
                scale={scale}
            />
        </PositionedView>
    )
}
