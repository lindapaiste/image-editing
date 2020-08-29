import { renderHook, act } from "@testing-library/react-hooks";
import { useControlledRectangle} from "./useControlledRectangle";
import {IRectangle} from "@lindapaiste/geometry";

//strip out extra props such that it doesn't matter if r is just an I_Rectangle or a class implementing it
export const toProps = (r: IRectangle): IRectangle => ({
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height
});

test("a controlled rectangle can move and scale, but won't exceed its boundaries", () => {
    const initialRectangle = {
        x: 100,
        y: 100,
        width: 200,
        height: 200
    };

    const boundaries = {
        x: 0,
        y: 0,
        width: 400,
        height: 400
    };

    const { result } = renderHook(() =>
        useControlledRectangle({ initialRectangle, boundaries })
    );
    // assert initial state
    expect(result.current.isDragging).toBe(false);
    expect(result.current.rectangle).toEqual(initialRectangle);

    // begin dragging
    act(() => {
        result.current.startDrag();
    });
    // assert new state
    expect(result.current.isDragging).toBe(true);
    expect(result.current.rectangle).toEqual(initialRectangle);

    // drag without overflow
    act(() => {
        result.current.shiftX(50);
    });
    // assert that the rectangle moved
    expect(result.current.isDragging).toBe(true);
    expect(toProps(result.current.rectangle)).toEqual({
        x: 150,
        y: 100,
        width: 200,
        height: 200
    });

    // drag outside of boundaries
    act(() => {
        result.current.shiftX(500);
    });
    // assert that the rectangle was kept inside
    expect(result.current.isDragging).toBe(true);
    expect(toProps(result.current.rectangle)).toEqual({
        x: 200,
        y: 100,
        width: 200,
        height: 200
    });

    //stop drag
    act(() => {
        result.current.endDrag();
    });
    // assert that the rectangle stays the same
    expect(result.current.isDragging).toBe(false);
    expect(toProps(result.current.rectangle)).toEqual({
        x: 200,
        y: 100,
        width: 200,
        height: 200
    });

    //scale to an okay amount
    act(() => {
        result.current.scale(0.5);
    });
    // assert that the rectangle shrinks
    expect(result.current.isDragging).toBe(false);
    expect(toProps(result.current.rectangle)).toEqual({
        x: 250,
        y: 150,
        width: 100,
        height: 100
    });
});
