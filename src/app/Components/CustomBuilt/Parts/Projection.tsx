import Camera from './Camera'
class Projection {
    static NEAR: number;
    FAR: number;
    RIGHT: number;
    LEFT: number
    TOP: number
    BOTTOM: number
    m00: number;
    m11: number;
    m22: number;
    m33: number;
    projection_matrix: any[][];
    
    constructor(canvasWidth: number, canvasHeight: number){
        this.NEAR = Camera.near_plane
        this.FAR = Camera.far_plane
        this.RIGHT = Math.tan(Camera.h_fov / 2)
        this.LEFT = -this.RIGHT
        this.TOP = Math.tan(Camera.v_fov / 2)
        this.BOTTOM = -this.TOP

        this.m00 = 2 / (this.RIGHT - this.LEFT)
        this.m11 = 2 / ( this.TOP - this.BOTTOM)
        this.m22 = (this.FAR + this.NEAR) / (this.FAR - this.NEAR)
        this.m33 = -2 * this.NEAR * this.FAR / ( this.FAR - this.NEAR)
        this.projection_matrix = [
            [this.m00,0,0,0],
            [0,this.m11,0,0],
            [0,0,this.m22,0],
            [0,0,0,this.m33]
        ]
    }
}
export default Projection