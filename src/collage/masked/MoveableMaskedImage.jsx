import * as React from 'react';
import Rectangle, {MovementBoundaries} from '../objects/Rectangle';
import Draggable from '../../../../shs-react-redux-app/src/components/interactivity/DragController';
import {Span, View} from '../../../../shs-react-redux-app/src/components/ui/elements';
import {ValidatedTextInput} from '../../../../shs-react-redux-app/src/components/ui/form-elements';
import {MinusButton, PlusButton} from '../controls/image-editor-controls';
import {IncrementableJoystick as Joystick} from "../controls/Joystick";
import {CroppedImage} from "../../../../shs-react-redux-app/src/components/images/CroppedImage";

//rewrite using translate of 0 to imply that the image is centered
export default class MoveableMaskedImage extends React.Component {
    static defaultProps = {
        viewScale: 1,
        rectangle: new Rectangle(250, 375, 0, 0),
        moveable: true,
        resizable: true,
        showControls: true,
    }
    minScale = 100 * Math.max(
        this.props.rectangle.height / this.props.image.height,
        this.props.rectangle.width / this.props.image.width);
    //initial position is centered and scaled to fit
    state = {
        translateX: 0,
        translateY: 0,
        imageScale: this.minScale,
    }

    componentDidMount() {
    }

    getObjectBoundaries() {
        return this.props.image.getRectangle().scale(this.state.imageScale / 100).setCenter({
            x: 0, //this.state.translateX,
            y: 0, //this.state.translateY
        });
    }

    getMovementBoundaries() {
        return new MovementBoundaries(
            this.getObjectBoundaries(),
            this.props.rectangle.clone().setCenter({
                x: 0,
                y: 0
            }),
            'cover'
        );
    }

    doMove(x, y) {
        let move = {x, y};
        move = this.getMovementBoundaries().constrainPoint(move);
        this.setState({
            translateX: move.x,
            translateY: move.y,
        })
    }

    doScale(percent) {
        percent = Math.max(percent, this.minScale);
        this.setState({
            imageScale: percent
        })
    }

    getMaskRectangle() {
        //mask is the relationship between the image and the boundaries,
        //so even though both seem centered at (0,0),
        //the mask position is relative
        const objectBoundaries = this.getObjectBoundaries();
        return this.props.rectangle.clone().setCenter({
            x: .5 * objectBoundaries.width - this.state.translateX,
            y: .5 * objectBoundaries.height - this.state.translateY
        });
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
            return value >= this.minScale;
        } else {
            let movementBoundaries = this.getMovementBoundaries();
            if (field === 'translateX') {
                return movementBoundaries.containsPoint({x: value, y: this.state.translateY});
            } else if (field === 'translateY') {
                return movementBoundaries.containsPoint({x: this.state.translateX, y: value});
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
                <Span>{units}</Span>
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
    renderImage = () => {
        return (
            <CroppedImage
                rectangle={this.getMaskRectangle()}
                scale={this.props.viewScale}
                image={this.props.image.scale(this.state.imageScale / 100)}
            />
        )
    }

    render() {
        console.log(this.state);
        console.log('mask rectangle');
        console.log(this.getMaskRectangle());
        console.log('MovementBoundaries');
        console.log(this.getMovementBoundaries());
        console.log('object boundaries');
        console.log(this.getObjectBoundaries());
        console.log('mask boundaries');
        console.log(this.props.rectangle.clone().setCenter({
            x: 0,
            y: 0
        }));

        return (
            <View>
                {this.props.showControls && this.renderControls()}
                <Draggable translateX={this.state.translateX} translateY={this.state.translateX} onDrag={this.onDrag}
                           render={this.renderImage}>
                </Draggable>
            </View>
        )
    }
}

const RenderMoveableMaskedImage = (props) => {

}

//can't use the Cropped Image element because the Draggable part is the inside
/*
      let rectangle = this.getMaskRectangle();
      let scale = this.props.viewScale;
    return (
    <>
      {this.props.showControls && this.renderControls()}
<Draggable>
    <FixedSizeView
      width={rectangle.width * scale}
      height={rectangle.height * scale}>
      <TranslatedView
        translateX={ -1 * rectangle.x1 * scale }
        translateY={ -1 * rectangle.y1 * scale }
      >
      <FixedSizeImage
        image={image}
        width={image.width * scale}
        height={image.height * scale}
      />
      </TranslatedView>
    </FixedSizeView>
*/

/*
export class MoveableMaskedImage extends React.Component {
  static defaultProps = {
    viewScale: 1,
    rectangle: new Rectangle( 250, 375, 0, 0),
    moveable: true,
    resizable: true,
    showControls: true,
  }
  minScale = 100 * Math.max(
    this.props.rectangle.height / this.props.image.height,
    this.props.rectangle.width / this.props.image.width );
  //initial position is centered and scaled to fit
  minTranslateX = () => {
    return this.props.rectangle.width - ( this.state.imageScale / 100 * this.props.image.width );
  }
  minTranslateY = () => {
    return this.props.rectangle.height - ( this.state.imageScale / 100 * this.props.image.height );
  }
  state = {
      translateX: 0,
      translateY: this.props.rectangle.center.y -this.props.image.getRectangle().center.y,
      imageScale: this.minScale,
  }
  componentDidMount() {
    this.setField( 'translateX', .5 * this.minTranslateX() );
    this.setField( 'translateY', .5 * this.minTranslateY() );
  }
  getObjectBoundaries() {
    //return this.props.image.getRectangle().scale( this.state.imageScale / 100 );
    return RectangleFromObject({
      x: this.state.translateX,
      y: this.state.translateY,
      width: this.props.image.width * this.state.imageScale / 100,
      height: this.props.image.height * this.state.imageScale / 100,
    });
  }
  doMove( x, y ) {
    let move = { x, y };
    const object = this.getObjectBoundaries();
    const boundaries = this.props.rectangle;
    move = restrictMove ( move, object, boundaries, 'cover' );
    this.setState({
      translateX: move.x,
      translateY: move.y,
    })
  }
  doScale( percent ) {
    percent = Math.max( percent, this.minScale );
    this.setState({
      imageScale: percent
    })
  }
  center() {
    console.log ( 'min x: ' + this.minTranslateX() )
    console.log ( 'min y: ' + this.minTranslateY() )
    this.setState({
      translateX: .5 * this.minTranslateX(),
      translateY: .5 * this.minTranslateY(),
    })
  }
  getMaskRectangle() {
    return this.props.rectangle._clone()
      .shiftX( -1 * this.state.translateX )
      .shiftY( -1 * this.state.translateY );
  }
  setField( field, value ) {
    if ( field === 'translateX' ) {
      this.doMove( value, 0 );
    } else if ( field === 'translateY' ) {
      this.doMove( 0, value );
    } else if ( field === 'imageScale' ) {
      this.doScale( value );
    }
//    this.setState({
//      [field]: this.enforceBoundaries(field, value),
//    })
  }
  onChangeText = (text, field) => {
    const value = parseInt( text )  || 0;
    this.setField( field, value );
  }
  onIncrement = (field, decrease = false ) => {
    //const multiplier = decrease ? .95 : 1.05;
    const change = decrease ? -5 : 5;
    this.setField( field, change + this.state[field] );
//    this.setState( prevState => { return ({
//      [field]: multiplier * prevState[field]
//    });
//    })
  }
  enforceBoundaries( field, value ) {
    if ( field === 'translateX' ) {
      value = Math.min( Math.max( value, this.minTranslateX() ), 0);
    } else if ( field === 'translateY' ) {
      value = Math.min( Math.max( value, this.minTranslateY() ), 0);
    } else if ( field === 'imageScale' ) {
      value = Math.max( value, this.minScale );
    }
    return value;
  }
  renderControl( field, label, units ) {
    return(
  <View>
    <ManagedTextInput value={this.state[field] || ''} label={label} onChangeText={(text) => this.onChangeText(text, field)} />
    <Span>{units}</Span>
    <TextButton onPress={() => this.onIncrement(field, true)}>Minus</TextButton>
    <TextButton onPress={() => this.onIncrement(field, false)}>Plus</TextButton>
  </View>
)
  }
  renderControls() {
    if ( this.props.showControls ) {
return(
  <>
  {this.renderControl( 'imageScale', 'Scale:', '%' )}
  {this.renderControl( 'translateX', 'X:', 'px' )}
  {this.renderControl( 'translateY', 'Y:', 'px' )}
</>
)}
else return null;
  }
  render() {
    console.log( this.state );
    console.log( this.getMaskRectangle());
    console.log( this.props.image.scale(.5) );
    return (
    <>
      {this.props.showControls && this.renderControls()}
<Draggable>
      <CroppedImage
        rectangle={this.getMaskRectangle()}
        scale={this.props.viewScale}
        image={this.props.image.scale( this.state.imageScale / 100 )}
      />
      </Draggable>
      </>
    )
  }
}*/
