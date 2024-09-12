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
export function matmul(matrix: number[][], vector: number[]): number[] {
    let result = Array(matrix.length).fill(0);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < vector.length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

export function crossProduct(triangle: number[][]) {
    let [x1, y1, z1, w1] = triangle[0];
    let [x2, y2, z2, w2] = triangle[1];
    let [x3, y3, z3, w3] = triangle[2];
    
    let edge1 = [x2 - x1, y2 - y1, z2 - z1];
    let edge2 = [x3 - x1, y3 - y1, z3 - z1];

    // Calculate the normal vector of the triangle
    let Nx = ((y2 - y1) * (z3 - z1) - (z2 - z1) * (y3 - y1));
    let Ny = -((x2 - x1) * (z3 - z1) - (z2 - z1) * (x3 - x1));
    let Nz = ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
    // Calculate the dot product of the normal with the vector from the player to the triangle DO NOT INCLUDE PLAYER X Y AND Z IT BROKEN IT BROKEN IT BROKEN IT BROKEN IT BROKEN
    return [Nx * (x1), Ny * (y1), Nz * (z1)];
}


export function dotProduct(A: number[], B: number[]){
    let [aX, aY, aZ] = A
    let [bX, bY, bZ] = B
    
    return aX * bX + aY * bY + aZ * bZ
}
 
export function getMagnitude(V: number[]) {
    return Math.sqrt(V[0] * V[0] + V[1] * V[1] + V[2] * V[2]);
}

export function cosineSimilarity(A: number[], B: number[]) {
    const dotProd = dotProduct(A, B);
    const magA = getMagnitude(A);
    const magB = getMagnitude(B);
    return (dotProd / (magA * magB));
}
export function GetDistanceX([x1,y1,z1] : number[],[x2,y2,z2] : number[]){
    return Math.sqrt(
        (x2 - x1) ** 2 + 
        (z2 - z1) ** 2
    )
}
export function getFullDistance([x1,y1,z1] : number[],[x2,y2,z2] : number[]){
    return Math.sqrt(
        (x2 - x1) ** 2 + 
        (y2 - y1) ** 2 + 
        (z2 - z1) ** 2 
    )
}