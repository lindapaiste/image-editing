import React from "react";
import {BoxRenderProps} from "./types";
import {maybeResolveProp} from "../../../../shs-react-redux-app/src/util/generateProp";
import {isSamePoint} from "../../../../shs-react-redux-app/src/util/geometry/rectanglePoints/enums";
import {makeBoxStyle, makeDotStyle} from "./styles";
import {TouchableHighlight, View} from "react-native";

/**
 * use absolute positioning for the box and the dots, so they must be inside of a parent with position=relative
 * default styles are applied, but can be overwritten with passed boxStyle and dotStyle
 */
export const BoundingBox = ({rectangle, points, boxStyle, dotStyle, dotSize = 6, onPressBox, onPressDot, activePoint = null, isActive = false}: BoxRenderProps) => {
    return (
        <View>
            <TouchableHighlight
                onPress={(e) => onPressBox(e.nativeEvent)}
                style={[
                    makeBoxStyle({rectangle}),
                    maybeResolveProp(boxStyle, isActive)
                ]}
            />
            {points.map((point) => (
                <TouchableHighlight
                    key={point.xName + point.yName}
                    style={[
                        makeDotStyle({point, dotSize}),
                        maybeResolveProp(dotStyle, isSamePoint(point, activePoint))
                    ]}
                    onPress={(e) => onPressDot(e.nativeEvent, point)}
                />
            ))}
        </View>
    )
};

export default BoundingBox;
