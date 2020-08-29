import {CSSProperties} from "react";
import {ViewStyle} from "react-native";
import {I_Rectangle} from "../../../../shs-react-redux-app/src/util/geometry/rectangle/types";
import {I_RectanglePoint} from "../../../../shs-react-redux-app/src/util/geometry/rectanglePoints/types";

export const makeBoxStyle = ({rectangle}: { rectangle: I_Rectangle }): CSSProperties & ViewStyle => ({
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "gray",
    width: rectangle.width,
    height: rectangle.height,
    //use EITHER transform or absolute positioning
    //transform: 'translate(' + this.x + 'px,' + this.y + 'px );'
    position: 'absolute',
    left: rectangle.x,
    top: rectangle.y,
});

export const makeDotStyle = ({point, dotSize}: { point: I_RectanglePoint, dotSize: number }): CSSProperties & ViewStyle => ({
    width: dotSize,
    height: dotSize,
    position: 'absolute',
    left: point.x,
    top: point.y,
    borderRadius: .5 * dotSize,
    margin: -.5 * dotSize,
    backgroundColor: 'gray',
})
