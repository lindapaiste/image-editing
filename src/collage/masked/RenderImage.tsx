import React, {useEffect, useState} from "react";
import {DragMove, useDragMove, XY} from "@lindapaiste/react-controls";
import {TranslatedView} from "@lindapaiste/react-native-layout";
import {ScaledImage} from "@lindapaiste/react-native-image-sizing";
import {ImageState} from "../free/types";

/**
 * renders the image within the rectangular slot, but does not include the rectangle
 */

export interface RenderImageProps {
    select(): void;

    setPosition(point: XY): void;

    state: ImageState;
}

export const RenderImage = ({state, setPosition, select}: RenderImageProps) => {
    const [isDragging, setIsDragging] = useState(false);

    /**
     * when drag starts, make sure the image is selected
     * alternatively, could break up useDragMove into individual handlers and call inside onMouseDown
     */
    useEffect( () => {
        if ( isDragging ) {
            select();
        }
    }, [isDragging]);

    return (
        <DragMove
            position={state}
            setPosition={setPosition}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
        >
            <TranslatedView
                translateX={state.x}
                translateY={state.y}
            >

                <ScaledImage
                    image={state.original}
                    scale={state.scale}
                />
            </TranslatedView>
        </DragMove>
    )
}
