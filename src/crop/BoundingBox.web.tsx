import React from "react";
import {BoxRenderProps} from "./types";
import {maybeResolveProp} from "../../../../shs-react-redux-app/src/util/generateProp";
import {isSamePoint} from "../../../../shs-react-redux-app/src/util/geometry/rectanglePoints/enums";
import {makeBoxStyle, makeDotStyle} from "./styles";

/**
 * use absolute positioning for the box and the dots, so they must be inside of a parent with position=relative
 * default styles are applied, but can be overwritten with passed boxStyle and dotStyle
 */
export const BoundingBox = ({rectangle, points, boxStyle, dotStyle, dotSize = 6, onPressBox, onPressDot, activePoint = null, isActive = false}: BoxRenderProps) => {
    return (
        <div>
            <div
                className={"crop-box" + isActive ? " active" : " inactive"}
                style={{
                    ...makeBoxStyle({rectangle}),
                    ...maybeResolveProp(boxStyle, isActive)
                }}
                onClick={(e) => onPressBox(e)}
            />
            {points.map((point) => (
                <div
                    className={"hot-corner" + isSamePoint(point, activePoint) ? " active" : " inactive"}
                    key={point.xName + point.yName}
                    style={{
                        ...makeDotStyle({point, dotSize}),
                        ...maybeResolveProp(dotStyle, isSamePoint(point, activePoint))
                    }}
                    onClick={(e) => onPressDot(e, point)}
                />
            ))}
        </div>

    )
};

export default BoundingBox;
