import {View} from "react-native";
import React, {ComponentType} from "react";
import {JoystickDirection} from "./types";
import {BasicStyle} from "../crop/types";
import {MaybeFunction, resolveOptionalProp, resolveProp} from "@lindapaiste/function-props";
import {styles} from "./styles";
import {FlexColumn, FlexRow} from "@lindapaiste/react-native-layout";

export interface IconProps {
    color?: number;
    size?: number;
}

export interface Props {
    /**
     * action to apply to each button press
     * could pass a record of specific button callbacks,
     * or can have one function which receives the direction as a prop
     */
    onPress(direction: JoystickDirection): void;

    /**
     * apply style to all direction buttons
     */
    buttonStyle?: BasicStyle;
    /**
     * apply style to specific direction buttons only
     */
    directionStyle?: Partial<Record<JoystickDirection, BasicStyle>>;
    /**
     * can disable the whole joystick or particular directions
     */
    disabled?: MaybeFunction<boolean, JoystickDirection>;
    /**
     * can pass size and color to icons
     */
    iconProps?: MaybeFunction<IconProps, JoystickDirection>;
}

export const JoystickStyled = ({onPress, buttonStyle, directionStyle = {}, disabled = false, iconProps}: Props) => {

    const getButtonStyle = (direction: JoystickDirection): BasicStyle => {
        return {...styles.button, ...buttonStyle, ...directionStyle[direction]};
    }

    const renderButton = (direction: JoystickDirection, IconComponent: ComponentType<IconProps> = () => null) => {
        return (
            <button
                onClick={() => onPress(direction)}
                disabled={resolveProp(disabled, direction)}
                style={getButtonStyle(direction)}
            >
                <View>
                    <IconComponent
                        {...resolveOptionalProp(iconProps, direction)}
                    />
                </View>
            </button>
        )
    }

    return (
        <FlexColumn>
            <FlexRow>
                {renderButton("up")}
            </FlexRow>
            <FlexRow>
                {renderButton("left")}
                {renderButton("center")}
                {renderButton("right")}
            </FlexRow>
            <FlexRow>
                {renderButton("down")}
            </FlexRow>
        </FlexColumn>
    )
}
