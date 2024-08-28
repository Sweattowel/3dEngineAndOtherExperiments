class Camera{
    static position: number[]
    static forward: number[]
    static up: number[]
    static right: number[]
    static h_fov: number
    static v_fov: number
    static near_plane: number
    static far_plane: number
    static camera_matrix: number[][]
    
    constructor(position: any, canvasWidth: number, canvasHeight: number){
        this.position = [position, 1.0]
        this.forward = [0,0,1,1]
        this.up = [0,1,0,1]
        this.right = [1,0,0,1]
        this.h_fov = Math.PI / 3
        this.v_fov = this.h_fov * (canvasHeight / canvasWidth)
        this.near_plane = 0.1
        this.far_Plane = 100
    }
    
    translate_matrix(){
        let [x,y,z,w] = this.position
        return [
            [1,0,0,0],
            [0,1,0,1],
            [0,0,1,0],
            [-x,-y,-z,1]
        ]
    }
    rotate_matrix(){
        let [rx,ry,rz,rw] = this.right
        let [fx,fy,fz,fw] = this.forward
        let [ux,uy,uz,uw] = this.up
        return [
            [rx,ux,fx,0],
            [ry,uy,fy,0],
            [rz,uz,fz,0],
            [0,0,0,1],
        ]
    }
    camera_matrix(){
        return this.translate_matrix() && this.rotate_matrix()
    }
}
export default Camera