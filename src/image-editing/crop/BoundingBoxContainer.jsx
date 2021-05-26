import React from "react";
import {Rectangle} from "@lindapaiste/geometry";
import {BoundingBox} from "./BoundingBox.web";

/**
 * old version is a class component which handles keyboard and mouse events internally
 * does a lot of math which has now been offloaded to the geometry package
 */

export class BoundingBoxContainer extends React.Component {
    static defaultProps = {
        rectangle: new Rectangle({width: 500, height: 500}),
        movable: true,
        resizable: true,
        fixedRatio: true,
    };

    state = {
        rectangle: this.props.rectangle,
        isDragging: false,
        mouseX: null,
        mouseY: null,
        activePoint: null,
        history: [],
        //aspectRatio: this.props.fixedRatio ? ( this.props.width / this.props.height ) : null,
        //TODO: does this re-render when props change?
    };

    /*    componentWillReceiveProps() {
            this.setState({
               rectangle: this.props.rectangle
            });
        }*/
    addToHistory() {
        this.setState({
            history: this.state.history.concat(this.state.rectangle)
        });
    }

    getPrevious() {
        let count = this.state.history.length;
        if (count > 0) {
            return this.state.history[count - 1];
        } else {
            return null;
        }
    }

    undo() {
        this.setState({rectangle: this.getPrevious()});
        //TODO: remove from history
    }

    //-----------------------------KEYBOARD CONTROLS----------------------------//

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        console.log(e);
        //move events
        if (this.props.movable) {
            if (e.key === 'ArrowLeft') {
                this.shiftRectangle(-1, 0);
            } else if (e.key === 'ArrowRight') {
                this.shiftRectangle(1, 0);
            } else if (e.key === 'ArrowUp') {
                this.shiftRectangle(0, -1);
            } else if (e.key === 'ArrowDown') {
                this.shiftRectangle(0, 1);
            }
        }
        //resize events
        if (this.props.resizable) {
            if (e.key === '-') {
                this.scaleRectangle(1 - 1 / this.state.rectangle.width);
            } else if (e.key === '=' || e.key === '+') {
                this.scaleRectangle(1 + 1 / this.state.rectangle.width);
            }
        }
    };

    //-----------------------------SCALE RESIZE----------------------------//

    scaleRectangle(scale, fixedPoint) {
        const max = this.maxScale();
        if (max) {
            scale = Math.min(scale, max);
        }
        this.setState({
            rectangle: this.state.rectangle.scale(scale, fixedPoint)
        });
        //will push inside bounds if moved out, but synchronicity is a problem
        this.shiftRectangle(0, 0);
    }

    maxScale() {
        if (this.boundaries) {
            return Math.min(this.boundaries.width / this.state.rectangle.width,
                this.boundaries.height / this.state.rectangle.height);
        } else {
            return null;
        }
    }

    scaleChange(change) {
        const active = this.state.activePoint;
        const rectangle = this.state.rectangle;
        if (!active) {
            return 0;
        }
        //xmid, use y only
        else if (active.xName === 'xmid') {
            return Math.abs(change.y / rectangle.height);
        }
        //ymid, use x only
        else if (active.yName === 'ymid') {
            return Math.abs(change.x / rectangle.width);
        }
        //for corners, average the two
        else {
            return .5 * (Math.abs(change.x / rectangle.width) + Math.abs(change.y / rectangle.height));
        }
    }

    calculateScale(change) {
        const scaleChange = this.scaleChange(change);
        console.log('scale change is ' + scaleChange);
        console.log(this.movedPoint(change));
        console.log(this.state.rectangle.containsPoint(this.movedPoint(change)));
        if (this.state.rectangle.containsPoint(this.movedPoint(change))) {
            return 1 - scaleChange;
        } else {
            return 1 + scaleChange;
        }
    }

    //-----------------------------FREE RESIZE----------------------------//

    movedPoint(change) {
        const point = this.state.activePoint.clone();
        //midpoints can only move out/in, not sideways
        if (point.xName !== 'xmid') {
            point.x += this.constrainXChange(change.x);
        }
        if (point.yName !== 'ymid') {
            point.y += this.constrainYChange(change.y);
        }
        return point;
    }

    movePoint(change) {
        const point = this.movedPoint(change);
        this.setState({
            rectangle: this.state.rectangle.stretchToPoint(point)
        });
    }

    //---------------------------------MOVE-------------------------------//

    shiftRectangle(x, y) {
        x = this.constrainXChange(x);
        y = this.constrainYChange(y);
        this.setState({
            rectangle: this.state.rectangle.shiftX(x).shiftY(y)
        });
    }

    constrainXChange(x) {
        //cannot overflow boundaries, if they are set
        if (this.props.boundaries) {
            //change will be a negative number if overflowing left or top
            x = Math.max(x, this.props.boundaries.x1 - this.state.rectangle.x1);
            x = Math.min(x, this.props.boundaries.x2 - this.state.rectangle.x2);
        }
        return x;
    }

    constrainYChange(y) {
        //cannot overflow boundaries, if they are set
        if (this.props.boundaries) {
            //change will be a negative number if overflowing left or top
            y = Math.max(y, this.props.boundaries.y1 - this.state.rectangle.y1);
            y = Math.min(y, this.props.boundaries.y2 - this.state.rectangle.y2);
        }
        return y;
    }

    //-----------------------------EVENT HANDLING--------------------------//

//click to enter move state and to leave it
    handleClick = (e, point = null) => {
        console.log('isDragging?');
        console.log(this.state.isDragging);
        if (this.state.isDragging) {
            this.endEvent();
        } else {
            this.beginEvent(e, point);
        }
    };

    beginEvent(e, point) {
        if (!this.state.isDragging) {
            this.setState({
                mouseX: e.pageX,
                mouseY: e.pageY,
                isDragging: true,
            });
            console.log(this.state);
            if (point) {
                if (this.props.resizable) {
                    this.setState({activePoint: point});
                    console.log('adding listeners');
                    window.addEventListener('mousemove', this.handleResize);
                    window.addEventListener('mousedown', this.endEvent);
                }
            } else {
                if (this.props.movable) {
                    this.setState({activePoint: null});
                    console.log('adding listeners');
                    window.addEventListener('mousemove', this.handleMove);
                    window.addEventListener('mousedown', this.endEvent);
                }
            }
        }
    }

    endEvent = () => {
        console.log('Mouse Up');
        if (this.state.isDragging) {
            this.setState({
                isDragging: false
            });
        }
        window.removeEventListener('mousemove', this.handleResize);
        window.removeEventListener('mousemove', this.handleMove);
        window.removeEventListener('mousedown', this.endEvent);
        console.log(this.state);
    };

    mouseMove(e) {
        if (this.state.isDragging) {
            console.log('Mouse Move');
            console.log(e);
            let changeX = e.pageX - this.state.mouseX;
            let changeY = e.pageY - this.state.mouseY;
            this.setState({
                mouseX: e.pageX,
                mouseY: e.pageY,
            });
            console.log(this.state);
            return {x: changeX, y: changeY};
        }
    }

    handleMove = (e) => {
        console.log('handleMove');
        let change = this.mouseMove(e);
        this.shiftRectangle(change);
    };

    handleResize = (e) => {
        console.log('handleResize');
        let change = this.mouseMove(e);
        console.log('change values: ');
        console.log(change);
        if (change) {
            if (this.props.fixedRatio === false) {
                change.x = this.constrainXChange(change.x);
                change.y = this.constrainYChange(change.y);
                this.movePoint(change);
            } else {
                let scale = this.calculateScale(change);
                let fixedPoint = this.state.rectangle.getOppositePoint(this.state.activePoint);
                console.log('scaling to ' + scale + 'from fixed point ');
                console.log(fixedPoint);
                this.scaleRectangle(scale, fixedPoint);
            }
        }
    };

    //-------------------------------RENDER-------------------------------//

    getPoints() {
        console.log(this.state);
        return this.state.rectangle.corners.concat(this.state.rectangle.midpoints);
    }

    render() {
        return (
            <BoundingBox
                rectangle={this.state.rectangle}
                points={this.getPoints()}
                onPressBox={this.handleClick}  //TODO: should be conditional on moveable
                onPressDot={this.handleClick}
                //handleMove={this.handleMove}
                //handleResize={this.handleResize}
            />
        )
    }
}
