class ColorHoverCanvas extends React.Component {
    static defaultProps = {
        r: 3, //radius in pixels
    };

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {};
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    mouseEnter = () => {
        this.setState({
            hover: true,
        });
        console.log('mouse enter');
    };
    mouseLeave = () => {
        this.setState({
            hover: false,
        });
        console.log('mouse leave');
    };
    pickColor = (e) => {
        //shouldn't be triggering on children but it is
        console.log( e.nativeEvent );
        if (this.state.hover ) { //need to avoid events triggered on the cursor
            const canvas = this.refs.canvasComponent;
            const context = canvas.getContext(); //can also use e.target
            //const rect = canvas.getPosition();
            const rect = canvas.refs.canvas.getBoundingClientRect();
            //if ( e.nativeEvent.target.tagName == 'CANVAS' )
            const r = this.props.r;
            let x = e.nativeEvent.x - rect.x;
            let y = e.nativeEvent.y - rect.y;
            /*if ( e.nativeEvent.target.className == 'color-picker-cursor' ) {
                const rect = e.nativeEvent.target.parentElement.getBoundingClientRect();
                x -= rect.x;
                y -= rect.y;
            }*/

            console.log('x: ' + x + ', y: ' + y + ', r: ' + r);
            console.log('coordinates: ' + [x - r, y - r, 2 * r, 2 * r]);
            const data = context.getImageData(x - r, y - r, 2 * r, 2 * r).data;
            //console.log(data);
            //console.log(context.getImageData(0, 0, 500, 500).data);
            this.setState({
                color: getAverageColor(data),
                x: x,
                y: y,
            });
        }
    };

    render() {
        return (
            <div
                className="color-hover-canvas"
                style={{position: "relative"}}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                onMouseMove={this.pickColor}
                onClick={this.props.onClick}
            >
                <ImageCanvas
                    //{...this.props}
                    ref="canvasComponent"
                    src={this.props.src}
                    width={this.props.width}
                    height={this.props.height}
                />
                {this.state.color &&
                <ColorPickerCursor
                    r={10}
                    x={this.state.x}
                    y={this.state.y}
                    color={this.state.color}
                />
                }
            </div>
        )
    }
}

const ColorPickerCursor = (props) => {
    const cssStyle = {
        background: '#' + props.color,
        width: 2 * props.r + 'px',
        height: 2 * props.r + 'px',
        position: 'absolute',
        top: '0',
        left: '0',
        transform: 'translate(' + (props.x - props.r) + 'px,' + (props.y - props.r) + 'px)',
        outline: '1px solid red',
    };
    return (
        <div className="color-picker-cursor" style={cssStyle}>
        </div>
    )
};

class ColorPickerCanvas extends React.Component {
    static defaultProps = {
        r: 3, //radius in pixels
    };

    constructor(props) {
        super(props);
        console.log(this.props);
    }

    componentDidUpdate() {
        if (this.props.onColorPicked) {
            this.props.onColorPicked(this.state.color);
        }
        console.log(this.state);
    }

    pickColor = (e) => {
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;
        let r = this.props.r;
        //let context = this.refs.canvasComponent.getContext(); //can also use e.target
        let context = e.nativeEvent.target.getContext('2d');
        console.log('x: ' + x + ', y: ' + y + ', r: ' + r);
        console.log('coordinates: ' + [x - r, y - r, 2 * r, 2 * r]);
        let data = context.getImageData(x - r, y - r, 2 * r, 2 * r).data;
        console.log(data);
        console.log(context.getImageData(0, 0, 500, 500).data);
        this.setState({
            color: getAverageColor(data)
        });
    };

    render() {
        return (
            <ImageCanvas
                //{...this.props}
                ref="canvas"
                src={this.props.src}
                width={this.props.width}
                height={this.props.height}
                onClick={this.pickColor}
            />
        )
    }
}

function getAverageColor(data) {
    return rgbaToHex(separateRgbaChannels(data).map(average));
}

function separateRgbaChannels(data) {
    let rgba = [[], [], [], []];
    for (let i = 0; i < data.length; i++) {
        let channel = i % 4;
        rgba[channel].push(data[i]);
    }
    return rgba;
}

function average(array) {
    if (!array.length) return null;
    let sum = array.reduce(function (a, b) {
        return a + b
    });
    return sum / array.length;
}

function rgbaString(array) {
    return 'rgba(' + array.join(', ') + ')';
}

function rgbaToHex(array) {
    console.log(array);
    return array.slice(0, 3).map(val => Math.round(val).toString(16).padStart(2, '0')).join('');
}