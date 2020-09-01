import {
    FilterCenterFocus,
    KeyboardArrowDown,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardArrowUp
} from "@material-ui/icons";
import {FlexColumn, FlexRow} from "@lindapaiste/react-native-layout";
import {JoystickDirection} from "./types";
import {MaybeFunction, resolveProp} from "@lindapaiste/function-props";
import React, {ComponentType} from "react";
import IconButton from '@material-ui/core/IconButton';


export interface Props {
    /**
     * action to apply to each button press
     * could pass a record of specific button callbacks,
     * or can have one function which receives the direction as a prop
     */
    onPress(direction: JoystickDirection): void;

    /**
     * can disable the whole joystick or particular directions
     */
    disabled?: MaybeFunction<boolean, JoystickDirection>;
}

export default ({onPress, disabled = false}: Props) => {

    const renderButton = (direction: JoystickDirection, IconComponent: ComponentType) => {
        return (
            <IconButton
                onClick={() => onPress(direction)}
                disabled={resolveProp(disabled, direction)}
            >
                <IconComponent/>
            </IconButton>
        )
    }

    return (
        <FlexColumn>
            <FlexRow>
                {renderButton("up", KeyboardArrowUp)}
            </FlexRow>
            <FlexRow>
                {renderButton("left", KeyboardArrowLeft)}
                {renderButton("center", FilterCenterFocus)}
                {renderButton("right", KeyboardArrowRight)}
            </FlexRow>
            <FlexRow>
                {renderButton("down", KeyboardArrowDown)}
            </FlexRow>
        </FlexColumn>
    )
}
