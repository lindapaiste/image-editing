import React from "react";
import useDragState from "../../../../shs-react-redux-app/src/components/interactivity/useDragState";
import {ISized, IPoint} from "@lindapaiste/geometry";
import { I_SizedImage } from "../../util";

export interface Props {
    image: I_SizedImage;
    size: ISized;
    initialOffset?: IPoint;
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
