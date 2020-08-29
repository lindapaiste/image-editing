import {I_Rectangle} from "../../../../shs-react-redux-app/src/util/geometry/rectangle/types";
import {CSSProperties} from "react";
import {ViewStyle} from "react-native";
import {MaybeGenerate} from "../../../../shs-react-redux-app/src/util/generateProp";
import {I_SizedImage} from "../../../../shs-react-redux-app/src/util/geometry/sized/SizedImage";
import {I_RectanglePoint} from "../../../../shs-react-redux-app/src/util/geometry/rectanglePoints/types";

export interface Settings {
    movable: boolean;
    resizable: boolean;
    fixedRatio: boolean;
}

/**
 * depending on what the image is being created for,
 * it may always require an image of a specific aspect ratio
 * requiring a specific size would be odd because the resulting image can always be resized
 * so rather than an "initialRectangle", which has arbitrary placement and needs to be checked for overflow,
 * tool logic should take an "initialAspectRatio" prop
 */
export interface ToolLogicProps {
    initialSettings?: Partial<Settings>;
    initialAspectRatio?: number;
    image: I_SizedImage;
}

export interface ToolLogicOwnReturns extends Settings {
    isPreview: boolean;

    toggleFixedRatio(): void;

    togglePreview(): void;

    onPressSave(): void;

    //setImageSize(size: I_Sized): void;

    boundaries: I_Rectangle;
}

export interface ToolLogicReturns extends ControlledRectangleReturns, ToolLogicOwnReturns {

}

/**
 * note that these props will be returned from ToolLogic once it's ready
 */
export interface ControlledRectangleProps {
    initialRectangle: I_Rectangle;
    boundaries: I_Rectangle;
}

//minimal required event
export type BoxMouseEvent = {
    pageX: number;
    pageY: number;
}

export type BasicStyle = CSSProperties & ViewStyle;

export interface BoxRenderProps {
    rectangle: I_Rectangle;
    points: I_RectanglePoint[];

    onPressBox(e: BoxMouseEvent): void;

    onPressDot(e: BoxMouseEvent, point: I_RectanglePoint): void;

    /**
     * can style differently based on whether the box or a dot is active
     * component receives this info as props, and also style props can depend on it
     */
    boxStyle?: MaybeGenerate<BasicStyle, boolean>
    dotStyle?: MaybeGenerate<BasicStyle, boolean>
    dotSize?: number;
    activePoint?: I_RectanglePoint | null;
    isActive?: boolean;
}

export interface RectangleActions {

    shift(changeX: number, changeY: number): void;

    shiftX(change: number): void;

    shiftY(change: number): void;

    scale(scale: number): void;

    scaleToPoint(point: I_RectanglePoint): void;

    increaseScale(): void;

    decreaseScale(): void;

    stretchToPoint(point: I_RectanglePoint): void;
}


export interface ControlledRectangleReturns extends RectangleActions {

    rectangle: I_Rectangle;

    undo(): void;

    redo(): void;

    startDrag(): void;

    endDrag(): void;

    isDragging: boolean;
}

export interface MouseControlsReturns {
    onPress(e: BoxMouseEvent, point?: I_RectanglePoint): void;
    activePoint: I_RectanglePoint | null; //return this because box renderer uses it to see which point is active
}

export type CompleteRenderProps =
    Omit<BoxRenderProps, 'onPressBox' | 'onPressDot'>
    & Omit<ToolLogicReturns, 'initialRectangle' | 'boundaries'>
    & ControlledRectangleReturns
    & MouseControlsReturns
    & {}
