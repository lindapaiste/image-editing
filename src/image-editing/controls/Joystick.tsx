import {StyleProp, View, ViewStyle} from "react-native";
import Button from "../../../../shs-react-redux-app/src/components/ui/Button";
import {IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconCenter} from "../../../../shs-react-redux-app/src/components/ui/Icons";
import React, {ComponentType, PropsWithChildren} from "react";
import {JoystickDirection, OnIncrement} from "./types";
import {BasicStyle} from "../crop/types";
import {MaybeFunction, resolveProp} from "@lindapaiste/function-props";
import {styles} from "./styles";

export interface IconProps {
    color?: number;
    size?: number;
}

export interface Props {
    //action to apply to each button press
    //could pass a record of specific button callbacks,
    //or can have one function which receives the direction as a prop
    onPress(direction: JoystickDirection): void;

    //apply style to all direction buttons
    buttonStyle?: BasicStyle;
    //apply style to specific direction buttons only
    directionStyle?: Partial<Record<JoystickDirection, BasicStyle>>;
    //can disable the whole joystick or particular directions
    disabled?: MaybeFunction<boolean, JoystickDirection>;
    //can pass size and color to icons
    iconProps?: MaybeFunction<IconProps, JoystickDirection>;
}

const JoystickRow = ({children}: PropsWithChildren<{}>) => (
    <View style={styles.joystickRow} children={children}/>
)

export const Joystick = ({onPress, buttonStyle, directionStyle = {}, disabled = false, iconProps}: Props) => {

    const getButtonStyle = (direction: JoystickDirection): StyleProp<ViewStyle> => {
        return [styles.button, buttonStyle, directionStyle[direction]];
    }

    const renderButton = (direction: JoystickDirection, IconComponent: ComponentType<IconProps>) => {
        return (
            <Button
                onPress={() => onPress(direction)}
                disabled={resolveProp(disabled, direction)}
                style={getButtonStyle(direction)}
            >
                <View>
                    <IconComponent
                        {...resolveProp(iconProps, direction)}
                    />
                </View>
            </Button>
        )
    }

    return (
        <View style={styles.joystick}>
            <JoystickRow>
                {renderButton("up", IconArrowUp)}
            </JoystickRow>
            <JoystickRow>
                {renderButton("left", IconArrowLeft)}
                {renderButton("center", IconCenter)}
                {renderButton("right", IconArrowRight)}
            </JoystickRow>
            <JoystickRow>
                {renderButton("down", IconArrowDown)}
            </JoystickRow>
        </View>
    )
}


/**
 * for back compat
 */
export type PropsIncrementable = Omit<Props, 'onPress'> & {
    onIncrement: OnIncrement;
    onCenter(): void;
}

export const IncrementableJoystick = ({onIncrement, onCenter, ...props}: PropsIncrementable) => {

    const onPress = (direction: JoystickDirection) => {
        switch (direction) {
            case "up":
                return onIncrement('translateY', false);
            case "down":
                return onIncrement('translateY', true);
            case "left":
                return onIncrement('translateX', false);
            case "right":
                return onIncrement('translateX', true);
            case "center":
                return onCenter();
        }
    }

    return (
        <Joystick
            {...props}
            onPress={onPress}
        />
    )
}
