import React from 'react';
import {IconMinus, IconPlus, IconZoomIn, TouchableIcon} from '../../../../shs-react-redux-app/src/components/ui/Icons';
import {View} from "react-native";
import ValidatedTextInput from '../../../../shs-react-redux-app/src/components/forms/ValidatedTextInput';
import styled from "styled-components";


export const StyledButton = styled(TouchableIcon)`
  color: white;
  background: black;
  border: none;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  margin: 2px;
`;


export const Zoom = (props) => {
    return (
        <>
            <StyledButton {...props}
                          Icon={IconZoomIn}
                          onPress={() => props.onIncrement('scale', false)}
            />
            <StyledButton {...props}
                          Icon={IconZoomIn}
                          onPress={() => props.onIncrement('scale', true)}
            />
        </>
    )
};

export const MinusButton = (props) => {
    return <StyledButton {...props} Icon={IconMinus}/>
};

export const PlusButton = (props) => {
    return <StyledButton {...props} Icon={IconPlus}/>
};

export const Field = ({fieldName, defaultValue, label, units, isValid, onValid, onIncrement}) => {
    return (
        <View>
            <ValidatedTextInput
                defaultValue={defaultValue}
                label={label}
                units={units}
                isValid={(text) => isValid(text, fieldName)}
                onValid={(text) => onValid(text, fieldName)}
            />
            <MinusButton onPress={() => onIncrement(fieldName, true)}/>
            <PlusButton onPress={() => onIncrement(fieldName, false)}/>
        </View>
    )
};
