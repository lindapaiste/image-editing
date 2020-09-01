import {JoystickDirection} from "./types";
import {MaybeFunction} from "@lindapaiste/function-props";
import {XY} from "@lindapaiste/react-controls";

export interface Props {
    position: XY;
    setPosition: (pos: XY) => void;
    center: XY;
    disabled?: MaybeFunction<boolean, JoystickDirection>;
}
