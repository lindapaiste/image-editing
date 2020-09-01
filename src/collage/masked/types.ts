import {IRectangle} from "@lindapaiste/geometry";

/**
 * a masked collage is defined by a series of rectangular slots
 */
export interface Props {
    width: number;
    height: number;
    slots: IRectangle[];
}
