import React, {Component} from 'react';
import MoveableMaskedImage from './MoveableMaskedImage';
import styled from 'styled-components';
import {FixedSizeView, PositionedView} from '../../../../shs-react-redux-app/src/components/sizing/sized-elements';
import ObjectArray from '../objects/ObjectArray';
import getScale from '../util/scale';
import Rectangle from '../objects/Rectangle';

//takes a series of predefined rectangles as spots
export default class MaskedCollage extends Component {
    width = this.props.width || ObjectArray.max(this.props.rectangles, 'x2');
    height = this.props.height || ObjectArray.max(this.props.rectangles, 'y2');
    viewScale = getScale(this.width, this.height);

    selectActiveImage() {
        //can show one set of controls for the active image
    }

    generateFile() {
    }

    getMaskRectangle(i) {
        return new Rectangle(
            this.props.rectangles[i].width,
            this.props.rectangles[i].height,
            0,
            0
        );
    }

    renderImage(i) {
        return (
            <PositionedView
                top={this.props.rectangles[i].y * this.viewScale}
                left={this.props.rectangles[i].x * this.viewScale}
            >
                <MoveableMaskedImage
                    rectangle={this.getMaskRectangle(i)}
                    viewScale={this.viewScale}
                    image={this.props.images[i]}
                    showControls={false}
                />
            </PositionedView>
        )
    }

    renderImages() {
        //let count = Math.min(this.props.rectangles.length, this.props.images.length);
        return this.props.images.map((image, i) => this.renderImage(i));
        //for (let i = 0; i < count; i++) {
        //  this.renderImage(i);
        //}
    }

    render() {
        return (
            <CollageWrapper
                width={this.width * this.viewScale}
                height={this.height * this.viewScale}
            >
                {this.renderImages()}
            </CollageWrapper>
        )
    }
}

const CollageWrapper = styled(FixedSizeView)`
  position: relative;
`
