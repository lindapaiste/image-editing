import React from "react";
import {BoxRenderProps} from "./types";
import {resolveProp} from "@lindapaiste/function-props";
import {makeBoxStyle, makeDotStyle} from "./styles";
import {TouchableHighlight, View} from "react-native";
import {isSamePoint} from "@lindapaiste/geometry/lib/rectanglePoints/booleans";

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
                    resolveProp(boxStyle, isActive)
                ]}
            />
            {points.map((point) => (
                <TouchableHighlight
                    key={point.xName + point.yName}
                    style={[
                        makeDotStyle({point, dotSize}),
                        // note: should be isSame check here be based on name or xy?
                        resolveProp(dotStyle, isSamePoint(point, activePoint))
                    ]}
                    onPress={(e) => onPressDot(e.nativeEvent, point)}
                />
            ))}
        </View>
    )
};

export default BoundingBox;
