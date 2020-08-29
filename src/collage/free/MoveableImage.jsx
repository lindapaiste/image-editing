import React from 'react';
import Draggable from '../../../../shs-react-redux-app/src/components/interactivity/DragController';
import {Span} from '../../../../shs-react-redux-app/src/components/ui/elements';
import {ValidatedTextInput} from '../../../../shs-react-redux-app/src/components/ui/form-elements';
import {MinusButton, PlusButton} from '../controls/image-editor-controls';
import {IncrementableJoystick as Joystick} from "../controls/Joystick";
import {View, Text} from "react-native";
//pass the movementBoundaries as a prop

export default class MoveableImage extends React.Component {
    static defaultProps = {
        viewScale: 1,
        moveable: true,
        resizable: true,
        showControls: false,
        minScale: 0, //max scale might be infinite
    }
    //initial position is centered and scaled to fit
    state = {
        translateX: 0,
        translateY: 0,
        imageScale: 1,
    }

    doMove(x, y) {
        let move = {x, y};
        move = this.props.moveArea.constrainPoint(move);
        this.setState({
            translateX: move.x,
            translateY: move.y,
        })
    }

    restrictScale(percent) {
        if (this.props.maxScale) {
            percent = Math.min(percent, this.props.maxScale);
        }
        //minscale is always set because it defaults to 0
        return Math.max(percent, this.props.minScale);
    }

    isValidScale(percent) {
        return !(percent < this.props.minScale || (this.props.maxScale && percent > this.props.maxScale));
    }

    doScale(percent) {
        percent = this.restrictScale(percent);
        this.setState({
            imageScale: percent
        })
    }

    setField(field, value) {
        if (field === 'translateX') {
            this.doMove(value, this.state.translateY);
        } else if (field === 'translateY') {
            this.doMove(this.state.translateX, value);
        } else if (field === 'imageScale') {
            this.doScale(value);
        }
        /*    this.setState({
              [field]: this.enforceBoundaries(field, value),
            }) */
    }

    onChangeText = (text, field) => {
        const value = parseInt(text) || 0;
        this.setField(field, value);
    }
    onIncrement = (field, increase = true) => {
        //const multiplier = decrease ? .95 : 1.05;
        const change = increase ? 5 : -5;
        this.setField(field, change + this.state[field]);
        /*this.setState( prevState => { return ({
          [field]: multiplier * prevState[field]
        });
        })*/
    }
    onCenter = () => {
        this.setState({
            translateX: 0,
            translateY: 0,
        })
    }
    isValid = (text, field) => {
        let value = parseInt(text) || 0;
        if (field === 'imageScale') {
            return this.isValidScale(value);
        } else {
            let moveArea = this.props.moveArea;
            if (field === 'translateX') {
                return moveArea.containsPoint({x: value, y: this.state.translateY});
            } else if (field === 'translateY') {
                return moveArea.containsPoint({x: this.state.translateX, y: value});
            }
        }
        return false;
    }

    renderControl(field, label, units) {
        //TODO: grey out when at max or min
        return (
            <View>
                <ValidatedTextInput
                    defaultValue={this.state[field]}
                    label={label}
                    units={units}
                    isValid={(text) => this.isValid(text, field)}
                    onValid={(text) => this.onChangeText(text, field)}
                />
                <Text>{units}</Text>
                <MinusButton onPress={() => this.onIncrement(field, false)}/>
                <PlusButton onPress={() => this.onIncrement(field, true)}/>
            </View>
        )
    }

    renderControls() {
        if (this.props.showControls) {
            return (
                <View>
                    {this.renderControl('imageScale', 'Scale:', '%')}
                    {this.renderControl('translateX', 'X:', 'px')}
                    {this.renderControl('translateY', 'Y:', 'px')}
                    <Joystick onIncrement={this.onIncrement} onCenter={this.onCenter}/>
                </View>
            )
        } else return null;
    }

    onDrag = ({x, y}) => {
        this.doMove(x, y);
    }
    //instead of just passing down the render prop, add the props from this to it
    doRenderImage = (draggableState) => {
        return (
            this.props.render({...draggableState, ...this.props})
        )
    }

    render() {
        console.log(this.state);

        return (
            <View>
                {this.props.showControls && this.renderControls()}
                <Draggable translateX={this.state.translateX} translateY={this.state.translateX} onDrag={this.onDrag}
                           render={this.doRenderImage}>
                </Draggable>
            </View>
        )
    }
}
/*
const RenderImage = (props) => {
  renderImage = () => {
    return (
      <ScaledImage
        scale={this.props.viewScale}
        image={this.props.image.scale(this.state.imageScale / 100)}
      />
    )
  }
}
*/
