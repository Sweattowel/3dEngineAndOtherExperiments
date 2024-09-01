export function clipTriangleToNearPlane(triangle: number[][], nearPlane: number) {
    let inside = [], outside = [];
    for (let i = 0; i < 3; i++) {
        // is triangle z value close? close is defined by nearPlane
        if (triangle[i][2] >= nearPlane) {
            inside.push(triangle[i]);
        } else {
            outside.push(triangle[i]);
        }
    }
    
    if (inside.length === 3) {
        return [triangle];  // No clipping needed
    }
    if (inside.length === 0) {
        return [];  // Fully clipped
    }

    let newTriangles = [];
    // one vertice is close? clip to triangle
    if (inside.length === 1) {
        let newVertex1 = interpolateToNearPlane(inside[0], outside[0], nearPlane);
        let newVertex2 = interpolateToNearPlane(inside[0], outside[1], nearPlane);
        newTriangles.push([inside[0], newVertex1, newVertex2]);
    } else if (inside.length === 2) {
        // two vertice is close? clip to quad i.e. two triangles as rectangle
        let newVertex1 = interpolateToNearPlane(inside[0], outside[0], nearPlane);
        let newVertex2 = interpolateToNearPlane(inside[1], outside[0], nearPlane);
        newTriangles.push([inside[0], inside[1], newVertex1]);
        newTriangles.push([inside[1], newVertex1, newVertex2]);
    }

    return newTriangles;
}

export function interpolateToNearPlane(inside: number[], outside: number[], nearPlane: number) {
    const t = (nearPlane - inside[2]) / (outside[2] - inside[2]);
    return [
        inside[0] + t * (outside[0] - inside[0]),
        inside[1] + t * (outside[1] - inside[1]),
        nearPlane,
        inside[3] + t * (outside[3] - inside[3])
    ];
}