/**
 * directions for Joystick or other movement
 */
export type MoveDirection = "up" | "down" | "left" | "right";
export type JoystickDirection = MoveDirection | "center";

/**
 * for back-compat mapping
 */
export interface OnIncrement {
    (property: "translateX" | "translateY", increase: boolean): void
}
