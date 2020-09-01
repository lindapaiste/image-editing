import {CSSProperties} from "react";
import {ViewStyle} from "react-native";
import {ImageFile} from  "../../../images/src";
import {IRectanglePoint, IRectangle} from "@lindapaiste/geometry";
import {MaybeFunction} from "@lindapaiste/function-props";

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
    image: ImageFile;
}

export interface ToolLogicOwnReturns extends Settings {
    isPreview: boolean;

    toggleFixedRatio(): void;

    togglePreview(): void;

    onPressSave(): void;

    //setImageSize(size: I_Sized): void;

    boundaries: IRectangle;
}

export interface ToolLogicReturns extends ControlledRectangleReturns, ToolLogicOwnReturns {

}

/**
 * note that these props will be returned from ToolLogic once it's ready
 */
export interface ControlledRectangleProps {
    initialRectangle: IRectangle;
    boundaries: IRectangle;
}

//minimal required event
export type BoxMouseEvent = {
    pageX: number;
    pageY: number;
}

export type BasicStyle = CSSProperties & ViewStyle;

export interface BoxRenderProps {
    rectangle: IRectangle;
    points: IRectanglePoint[];

    onPressBox(e: BoxMouseEvent): void;

    onPressDot(e: BoxMouseEvent, point: IRectanglePoint): void;

    /**
     * can style differently based on whether the box or a dot is active
     * component receives this info as props, and also style props can depend on it
     */
    boxStyle?: MaybeFunction<BasicStyle, boolean>
    dotStyle?: MaybeFunction<BasicStyle, boolean>
    dotSize?: number;
    activePoint?: IRectanglePoint | null;
    isActive?: boolean;
}

export interface RectangleActions {

    shift(changeX: number, changeY: number): void;

    shiftX(change: number): void;

    shiftY(change: number): void;

    scale(scale: number): void;

    scaleToPoint(point: IRectanglePoint): void;

    increaseScale(): void;

    decreaseScale(): void;

    stretchToPoint(point: IRectanglePoint): void;
}


export interface ControlledRectangleReturns extends RectangleActions {

    rectangle: IRectangle;

    undo(): void;

    redo(): void;

    startDrag(): void;

    endDrag(): void;

    isDragging: boolean;
}

export interface MouseControlsReturns {
    onPress(e: BoxMouseEvent, point?: IRectanglePoint): void;
    activePoint: IRectanglePoint | null; //return this because box renderer uses it to see which point is active
}

export type CompleteRenderProps =
    Omit<BoxRenderProps, 'onPressBox' | 'onPressDot'>
    & Omit<ToolLogicReturns, 'initialRectangle' | 'boundaries'>
    & ControlledRectangleReturns
    & MouseControlsReturns
    & {}
