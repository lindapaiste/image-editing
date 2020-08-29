import React, {Component} from 'react';
import {PositionedView} from '../../../../shs-react-redux-app/src/components/sizing/sized-elements';
import {View} from '../../../../shs-react-redux-app/src/components/ui/elements';
import getScale from '../util/scale';
import MoveArea from '../objects/MoveArea';
import MoveableImage from './MoveableImage';
import {ScaledImage} from "../../../../shs-react-redux-app/src/components/images/ImageSizes";
import {ImageInCollage} from '../objects/EditorImage';
import Draggable from "../../../../shs-react-redux-app/src/components/interactivity/DragController";
//freely move around images

//each image has source_url, width, height, scale, translateX, translateY

//z index

export default class MoveableCollage extends Component {
    static defaultProps = {
        width: 500,
        height: 500,
    };
    viewScale = getScale(this.props.width, this.props.height);
    state = {
        //images is an object of objects keyed by image key
        images: {},
        //layers is an indexed array returning the key of the image
        layers: []
    };

    componentDidMount() {
        this.props.images.map(image => this.addImage(image));
    }

    selectActiveImage() {
        //can show one set of controls for the active image
    }

    generateFile() {
        let canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;
        //.....
        let dataURL = canvas.toDataURL('image/png');
    }

    addImage(image) {
        //starts with position at the center and scale at 50% of collage height
        const imageObject = new ImageInCollage(image, this.props.width, this.props.height);
        //TODO: if key is already seen, modify it to be unique -- allows for multiple history of the same image at the same scale
        //add it as the top layer
        this.setState(prevState => ({
            images: {...prevState.images, [imageObject.key]: imageObject},
            layers: prevState.layers.concat(imageObject.key)
        }));
    }

    getImage(key) {
        return this.state.images[key];
    }

    updateImage(key, changedProperties) {
        this.setState(prevState => ({
            images: {...prevState.images, [key]: this.getImage(key).modifiedVersion(changedProperties)}
        }));
    }

    replaceImage(key, newImage) {
        this.setState(prevState => ({
            images: {...prevState.images, [key]: newImage}
        }));
    }

    raiseLayerByKey(key) {
        let i = this.state.layers.indexOf(key);
        return this.raiseLayerByIndex(i);
    }

    raiseLayerByIndex(i) {
        this.swapLayers(i, i + 1);
    }

    lowerLayerByIndex(i) {
        this.swapLayers(i, i - 1);
    }

    swapLayers(i, j) {
        //check for validity of indexes
        if (this.state.layers.length < Math.max(i, j)) {
            return false;
        }
        let swapped = this.state.layers;
        swapped[i] = this.state.layers[j];
        swapped[j] = this.state.layers[i];
        this.setState({
            layers: swapped
        });
        //returns true on successful swap, false on no swap
        return true;
    }

    renderImageByIndex(i) {
        let key = this.state.layers[i];
        return this.renderImageByKey(key);
    }

    renderImageByKey(key) {
        let image = this.state.images[key];
        console.log('rendering');
        console.log(image);
        //callback could potentially depend on i, especially if the same image exists twice
        return (
            <MoveableImage
                moveArea={MoveArea.forObject(image, this.getCanvasBoundaries())}
                viewScale={this.viewScale}
                image={image}
                maxScale={Math.min(this.props.width / image.width, this.props.height / image.height)}
                render={(values) => this.renderCallback(values, key)}
                key={key}
            />
        )
    }

    renderDraggable(key) {
        const image = this.getImage(key);
        return (
            <Draggable
                translateX={image.translateX}
                translateY={image.translateX}
                onDrag={(move) => this.doDrag(key, move)}
                render={this.doRenderImage}
            />
        )
    }

    doDrag = (key, move) => {
        this.replaceImage(key, this.getImage(key).moved(move))
    };
    doScale = (key, scale) => {
        this.replaceImage(key, this.getImage(key).scaled(scale))
    };

    renderImages() {
        return this.state.layers.map((key) => this.renderImageByKey(key));
    }

    renderCallback(values, key) {
        console.log(key);
        console.log(values);
        let image = values.image;
        return (
            <PositionedView
                x={this.viewScale * image.offsetX}
                y={this.viewScale * image.offsetX}
            >
                <ScaledImage
                    scale={this.viewScale * image.scale}
                    image={image}
                />
            </PositionedView>
        )
    }

    render() {
        console.log(this.state);
        return (
            <View style={{
                width: this.props.width * this.viewScale,
                height: this.props.height * this.viewScale,
                position: 'relative'
            }}>
                {this.state.layers.map(key => this.renderDraggable(key))}
            </View>
        )
    }
}

const ImageRenderCallback = (props) => {//({translateX, translateY, isDragging, onDrag}) => {
    console.log('callback props');
    console.log(props);
    return null;

};
/*
const RenderImage = (props) => {
    return (
        <ScaledImage
            scale={this.props.viewScale}
            image={this.props.image.scale(this.state.imageScale / 100)}
        />
    )
};

export const ControlledDragContainer = (props) => {
    return (
        <TranslatedView
            translateX={props.translateX}
            translateY={props.translateY}
        >
            {props.children}
        </TranslatedView>
    )
}
*/
