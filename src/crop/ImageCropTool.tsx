import React from "react";
import {useCropToolLogic} from "./useCropToolLogic";
import {useKeyboardControls} from "./useKeyboardControls";
import {useMouseControls} from "./useMouseControls";
import {ToolLogicProps} from "./types";
import {CroppedImage, Image} from "../../../images/src";
import BoundingBox from "./BoundingBox";
import {Rectangle} from "@lindapaiste/geometry";

/**
 * unsophisticated web rendering
 */
export const ImageCropTool = (props: ToolLogicProps) => {

    const {image} = props;

    const everything = useCropToolLogic(props);

    useKeyboardControls(everything);

    const {onPress, activePoint} = useMouseControls(everything);

    const {rectangle, toggleFixedRatio, togglePreview, onPressSave, isPreview, fixedRatio, isDragging} = everything;

    const rectObj = new Rectangle(rectangle);

    const points = [...rectObj.midpoints, ...rectObj.corners];

    return (

        <div
            className="image-cropper"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
            }}
        >
            <div className="cropped-image-controls">
                <button onClick={toggleFixedRatio}>{fixedRatio ? "Unlock" : "Lock"}</button>
                <button onClick={togglePreview}>Preview</button>
                <button onClick={onPressSave}>Save</button>
            </div>
            {isPreview &&
            <div className="cropped-image-preview">
                <CroppedImage image={image} rectangle={rectangle}/>
            </div>
            }
            <div
                className="image-holder"
                style={{
                    position: "relative",
                    width: image.width,
                    height: image.height,
                }}
            >
                <Image
                    {...image}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0
                    }}
                />
                <BoundingBox
                    rectangle={rectangle}
                    points={points}
                    onPressBox={onPress}
                    onPressDot={onPress}
                    activePoint={activePoint}
                    isActive={isDragging}
                />
            </div>
        </div>
    )
}

