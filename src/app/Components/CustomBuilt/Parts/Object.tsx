import Camera from './Camera';
import { translate, rotate_x, rotate_y, rotate_z, scale } from './Parts/HelperFunctions';

class Cube {
    vertexes: number[][];
    faces: number[][];

    constructor() {
        this.vertexes = [
            [0, 0, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1], [1, 0, 0, 1],
            [0, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 1]
        ];
        this.faces = [
            [0, 1, 2, 3], [4, 5, 6, 7], [0, 4, 5, 1],
            [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]
        ];
    }

    screen_projection(){
        this.vertexes = this.vertexes && Camera.camera_matrix
    }

    translate(pos: [number, number, number]) {
        this.vertexes = this.vertexes.map(vertex => translate(vertex, pos));
    }

    rotateX(angle: number) {
        this.vertexes = this.vertexes.map(vertex => rotate_x(vertex, angle));
    }

    rotateY(angle: number) {
        this.vertexes = this.vertexes.map(vertex => rotate_y(vertex, angle));
    }

    rotateZ(angle: number) {
        this.vertexes = this.vertexes.map(vertex => rotate_z(vertex, angle));
    }

    scale(scale_to: number) {
        this.vertexes = this.vertexes.map(vertex => scale(vertex, scale_to));
    }
}

export default Cube;
