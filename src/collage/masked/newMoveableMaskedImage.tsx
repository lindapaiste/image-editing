import {I_SizedImage} from "../../../../shs-react-redux-app/src/util/geometry/sized/SizedImage";
import React from "react";
import useDragState from "../../../../shs-react-redux-app/src/components/interactivity/useDragState";
import {I_Sized} from "../../../../shs-react-redux-app/src/util/geometry/sized/types";
import {CroppedImage} from "../../../../shs-react-redux-app/src/components/images/CroppedImage";
import {I_Point} from "../../../../shs-react-redux-app/src/util/geometry/rectanglePoints/types";

export interface Props {
    image: I_SizedImage;
    size: I_Sized;
    initialOffset?: I_Point;
    initialScale?: number;
}

export default ({size, image, initialScale = 1, initialOffset = {x: 0, y: 0}}: Props) => {

    const {translateX, translateY, isDragging, onDragStart} = useDragState({});

    const mask = {
        ...size,
        x: initialOffset.x - translateX,
        y: initialOffset.y - translateY,
    }

    return (
        <div
            onMouseDown={(e) => onDragStart(e.nativeEvent)}
        >
            <CroppedImage
                image={image}
                scale={initialScale}
                rectangle={mask}
            />
        </div>
    )
}
