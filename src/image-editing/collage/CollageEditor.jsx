import React, {Component} from 'react';
import {ImmutableRectangle as Rectangle} from '@lindapaiste/geometry';
import {FixedSizeView} from '@lindapaiste/layout';
import MoveableMaskedImage from './MoveableMaskedImage';
import styled from 'styled-components';

import MaskedCollage from './MaskedCollage';

export const VerticallyDivided = ({images, width, height}) => {
    width = width || 500;
    height = height || 500;
    const count = images.length;
    const rectangles = images.map(
        (image, i) => new Rectangle({width: width / count, height, x: i * width / count, y: 0})
    );
    return (
        <MaskedCollage
            images={images}
            rectangles={rectangles}
        />
    )
}

//const LeftRightDivided =
export default ({left, right, width, height}) => {
    return (
        <VerticallyDivided
            images={[left, right]}
            width={width}
            height={height}
        />
    )
}

export class LeftRightCollage extends Component {
    static defaultProps = {
        width: 500,
        height: 500
    }

    constructor(props) {
        super(props);
        this.state = {
            /*leftImageTranslate: {
              x: 0, y: 0
            },
            rightImageTranslate: {
              x: 0, y: 0
            },
            leftImageScale: 1,
            rightImageScale: 1*/
            //leftRectangle: this.props.left.getRectangle(),
            //rightRectangle: this.props.right.getRectangle()
        };
    }

    scale = 1; // TODO: I think this was supposed to be the scale to fit the window?

    getScale() {
        return this.scale;
    }

    getMaskRectangle() { //imageRectangle ) {
        let scale = this.getScale();
        console.log('scale');
        console.log(scale);
        return new Rectangle({
            width: scale * this.props.width / 2,
            height: scale * this.props.height});
        //0 - imageRectangle.x,
        //0 - imageRectangle.y );
    }

    getUnscaledRectangle() { //imageRectangle ) {
        return new Rectangle({
            width: this.props.width / 2,
            height: this.props.height});
        //0 - imageRectangle.x,
        //0 - imageRectangle.y );
    }

    selectActiveImage() {

    }

    //can show one set of controls for the active image
    generateImage() {
        let canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;
        let dataURL = canvas.toDataURL('image/png');
    }

    render() {
        console.log(this.props.left);
        console.log(this.props.right);
        return (
            <><CollageWrapper
                width={this.props.width * this.scale}
                height={this.props.height * this.scale}
            >
                <MoveableMaskedImage
                    rectangle={this.getUnscaledRectangle()}
                    viewScale={this.getScale()}
                    image={this.props.left}
                    showControls={false}
                />
                <MoveableMaskedImage
                    rectangle={this.getMaskRectangle()}
                    image={this.props.right}
                    showControls={false}
                />
            </CollageWrapper>
            </>
        )
    }
}

//how to pass down scale?
//can pass full size rectangle with scale value,
//or scaled down rectangle and scale=1

const CollageWrapper = styled(FixedSizeView)`
  display: flex;
`
