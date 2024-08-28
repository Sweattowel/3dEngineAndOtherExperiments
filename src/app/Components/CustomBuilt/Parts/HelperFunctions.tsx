export function translate(pos: [number, number, number]){
    let [tx, ty, tz] = pos;

    return [
        [1,0,0,tx],
        [0,1,0,ty],
        [0,0,1,tz],
        [0,0,0,1],
    ]
}
export function rotate_x(theta : number){
    return [
        [1,0,0,0],
        [0,Math.cos(theta),-Math.sin(theta),0],
        [0,Math.sin(theta),Math.cos(theta),0],
        [0,0,0,1],
    ]
}
export function rotate_y(theta : number){
    return [
        [Math.cos(theta), 0, -Math.sin(theta), 0],
        [0, 1, 0, 0],
        [Math.sin(theta), 0, Math.cos(theta), 0],
        [0, 0, 0, 1]
    ]
}
export function rotate_z(theta : number){
    return [
        [Math.cos(theta),-Math.sin(theta),0, 0],
        [Math.sin(theta),Math.cos(theta),0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]
}
export function scale(scale_to: number){
    return [
        [scale_to, 0, 0, 0],
        [0, scale_to, 0, 0],
        [0, 0, scale_to, 0],
        [0, 0, 0, 1],
    ]
}
export function matmul(matrix: number[] | any[], vector: number[] | any[]) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        result[i] = 0;
        for (let j = 0; j < vector.length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}