import { useEffect } from "react"
import {translate, rotate_x, rotate_y, rotate_z, scale, matmul} from './Parts/HelperFunctions'
import { randomShapes } from "./Data/ShapeFolder"

interface importStruc {
    dark : boolean
}
class __init__ {
    static height = 800
    static width = 800   
    static fps = 60 
    static scale = 4

}
export default function TwoDEngine( { dark } : importStruc){
    let up = false;
    let down = false;
    let left = false;
    let right = false;
    let turning = false;
    let strafing = false;    
    let pxyz : any = [
        0,
        0,
        -100,
    ]
    let pYang = 0.0;
    let pXang = 0.0;
    let pZang = 0.0

    useEffect(() => {
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        setInterval(run, 1000 / __init__.fps)
        //setInterval(() => console.log(pxyz), 1000 / 1)
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
        window.addEventListener("pointermove", (e) => pointerMove(e))
        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock();
          });
    },[])
    function run(){
        drawQueue = []
        clearRect()
        controlLogic();
        drawTriangles(worldLines)
        for (const obj of _obj){
            drawTriangles(obj);
        }
        
        drawTriangles(randomShapes)
        
        pixel(__init__.width / 2, __init__.height / 2)
    }

    const worldLines = [
        [
            -5000,0,0,1,
            0,0,0,1,
            0,0,0,1
        ],
        [
            0,-5000,0,1,
            0,0,0,1,
            0,0,0,1
        ],
        [
            0,0,-5000,1,
            0,0,0,1,
            0,0,0,1
        ],
        [
            0,0,0,1,
            5000,0,0,1,
            5000,0,0,1
        ],
        [
            0,0,0,1,
            0,5000,0,1,
            0,5000,0,1
        ],
        [
            0,0,0,1,
            0,0,5000,1,
            0,0,5000,1
        ]


    ]
    const _obj = [
        [
            // FORMAT
            // X1 Y1 Z1 W1 X2 Y2 Z2 W2 X3 Y3 Z3 W3
            // newest shape using 3 point triangle DUUUUHHHH
            [0, 0, 0, 1, 0, 200, 0, 1, 100, 200, 0, 1],  // Top left
            [100, 0, 0, 1, 0, 0, 0, 1, 100, 200, 0, 1],  // Top right
            [100, 0, 100, 1, 0, 0, 100, 1, 100, 200, 100, 1],  // Bottom right
            [0, 0, 100, 1, 0, 200, 100, 1, 100, 200, 100, 1],  // Bottom left
            [100, 0, 100, 1, 100, 200, 100, 1, 100, 0, 0, 1],  // Right side bottom half
            [100, 200, 0, 1, 100, 0, 0, 1, 100, 200, 100, 1],  // Right side top half
            [0, 0, 100, 1, 0, 200, 100, 1, 0, 0, 0, 1],  // Left side bottom half
            [0, 200, 0, 1, 0, 0, 0, 1, 0, 200, 100, 1],  // Left side top half
            [100, 200, 0, 1, 100, 200, 100, 1, 0, 200, 100, 1],  // Bottom bottom half
            [0, 200, 100, 1, 0, 200, 0, 1, 100, 200, 0, 1],  // Bottom top half
            [100, 0, 0, 1, 100, 0, 100, 1, 0, 0, 100, 1],  // Top bottom half
            [0, 0, 100, 1, 0, 0, 0, 1, 100, 0, 0, 1],  // Top top half     
            // FLOOR
            [
                -250,200,-250,1,
                -250,200,150,1,
                500,200,-250,1
            ],
            [
                500,200,150,1,
                500,200,-250,1,
                -250,200,150,1
            ,]
        ]
    ];
    
    function drawTriangles(triangles: number[][]) {
        const centerX = 400, centerY = 400;
        const perspective = 400;
        const nearPlane = 0.1;  // Small positive value as near plane distance
    
        for (const triangle of triangles) {
            let [x1, y1, z1, w1, x2, y2, z2, w2, x3, y3, z3, w3] = triangle;
    
            // Step 1 Adjust rotation of triangles to match player angle
            let p1 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x1 - pxyz[0], y1 - pxyz[1], z1 - pxyz[2], w1])));
            let p2 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x2 - pxyz[0], y2 - pxyz[1], z2 - pxyz[2], w2])));
            let p3 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x3 - pxyz[0], y3 - pxyz[1], z3 - pxyz[2], w3])));
    
            // Step two pass each triangles points intor clipping function with near plane to adjust based on player screen i.e. if triangle is cut off cut triangle into pieces
            const clippedTriangles = clipTriangleToNearPlane([p1, p2, p3], nearPlane);
    
            for (const clippedTriangle of clippedTriangles) {
                const [trans1, trans2, trans3] = clippedTriangle;
    
                // Perspective projection
                let dis1X = (trans1[0] / trans1[2]) * perspective + centerX;
                let dis1Y = (trans1[1] / trans1[2]) * perspective + centerY;
    
                let dis2X = (trans2[0] / trans2[2]) * perspective + centerX;
                let dis2Y = (trans2[1] / trans2[2]) * perspective + centerY;
    
                let dis3X = (trans3[0] / trans3[2]) * perspective + centerX;
                let dis3Y = (trans3[1] / trans3[2]) * perspective + centerY;
    
                // Calculate depth for sorting
                let zAverage = (trans1[2] + trans2[2] + trans3[2]) / 3;
                drawQueue.push([dis1X, dis1Y, dis2X, dis2Y, dis3X, dis3Y, zAverage]);
            }
        }
        drawInOrder();
    }
    
    function clipTriangleToNearPlane(triangle: number[][], nearPlane: number) {
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
    
    function interpolateToNearPlane(inside: number[], outside: number[], nearPlane: number) {
        const t = (nearPlane - inside[2]) / (outside[2] - inside[2]);
        return [
            inside[0] + t * (outside[0] - inside[0]),
            inside[1] + t * (outside[1] - inside[1]),
            nearPlane,
            inside[3] + t * (outside[3] - inside[3])
        ];
    }
    let drawQueue: number[][] = []
    function drawInOrder(){
        drawQueue.sort((a,b) => b[6] - a[6])
        //console.log(drawQueue)
        for (let i = 0; i < drawQueue.length; i++){
            let [dis1X, dis1Y, dis2X, dis2Y, dis3X, dis3Y] = drawQueue[i];           
            drawLine(dis1X, dis1Y, dis2X, dis2Y);
            drawLine(dis2X, dis2Y, dis3X, dis3Y);
            drawLine(dis3X, dis3Y, dis1X, dis1Y);   
            
            drawColourTriangle(dis1X,dis1Y,dis2X,dis2Y,dis3X,dis3Y)       
        }
    }

    function drawColourTriangle(x1: number ,y1: number ,x2: number ,y2: number ,x3: number ,y3: number ) {
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        if (ctx){

            ctx.fillStyle="#f4f"
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3);
            //ctx.lineTo(x4,y4);
            ctx.closePath();
            ctx.fill();
        } 
    }
    function pixel(x: number, y: number){
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        if (ctx){
            ctx?.fillRect(x,y,__init__.scale,__init__.scale)

        }

    }
    function drawLine(x1: number,y1: number,x2: number,y2 : number){
        //console.log(x1,y1,x2,y2)
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        if (ctx){
            ctx?.beginPath();
            ctx?.lineTo(x1,y1);
            ctx.strokeStyle= "#FFF";
            ctx?.lineTo(x2, y2);
            ctx?.stroke();
            ctx?.closePath();            
        }
    }
    function clearRect(){
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        if (ctx){
            ctx.fillStyle = "#000"
            ctx?.fillRect(0,0,__init__.width, __init__.height)
            ctx.fillStyle = "#fff"           
        }

    }
    function keyDown(evt: KeyboardEvent) {
        switch (evt.keyCode) {
            case 37: left = true; break;
            case 38: up = true; break;
            case 39: right = true; break;
            case 40: down = true; break;
            case 77: turning = true; break;
            case 78: strafing = true; break;
        }
    }

    function keyUp(evt: KeyboardEvent) {
        switch (evt.keyCode) {
            case 37: left = false; break;
            case 38: up = false; break;
            case 39: right = false; break;
            case 40: down = false; break;
            case 77: turning = false; break;
            case 78: strafing = false; break;
        }
    }
    let turnSpeed = 0.03;
    function controlLogic() {
        let playerSpeed = 4;
        //let turnSpeed = 0.03;
    
        if (up && !turning && !strafing) {
            // Move forward in the direction the player is facing
            pxyz[0] += Math.sin(pYang) * Math.cos(pXang) * playerSpeed;
            //pxyz[1] -= Math.sin(pXang) * playerSpeed;  // Vertical movement
            pxyz[2] += Math.cos(pYang) * Math.cos(pXang) * playerSpeed;
        }
        if (down && !turning && !strafing) {
            // Move backward in the direction the player is facing
            pxyz[0] -= Math.sin(pYang) * Math.cos(pXang) * playerSpeed;
            //pxyz[1] += Math.sin(pXang) * playerSpeed;  // Vertical movement
            pxyz[2] -= Math.cos(pYang) * Math.cos(pXang) * playerSpeed;
        }
        if (left && !turning && !strafing) {
            // Strafe left
            pxyz[0] -= Math.cos(pYang) * playerSpeed;
            pxyz[2] += Math.sin(pYang) * playerSpeed;
        }
        if (right && !turning && !strafing) {
            // Strafe right
            pxyz[0] += Math.cos(pYang) * playerSpeed;
            pxyz[2] -= Math.sin(pYang) * playerSpeed;
        }
    
        if (up && !turning && strafing) {
            //pxyz[0] += Math.sin(pYang) * playerSpeed
            pxyz[1] -= playerSpeed
            //pxyz[2] -= Math.sin(pYang) * playerSpeed
        }
        if (down && !turning && strafing) {
            //pxyz[0] -= Math.sin(pYang) * playerSpeed
            pxyz[1] += playerSpeed
            //pxyz[2] += Math.sin(pYang) * playerSpeed
        }
    
        if (up && turning) {
            pXang -= turnSpeed;
            pXang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pXang));  // Clamp pitch
        }
        if (down && turning) {
            pXang += turnSpeed;
            pXang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pXang));  // Clamp pitch
        }
        if (right && turning) {
            pYang += turnSpeed;
            if (pYang >= 2 * Math.PI) pYang -= 2 * Math.PI;  // Wrap yaw
        }
        if (left && turning) {
            pYang -= turnSpeed;
            if (pYang < 0) pYang += 2 * Math.PI;  // Wrap yaw
        }
    }
    function pointerMove(e: PointerEvent) {
        const newX = e.movementX;
        const newY = e.movementY;
    
        // Update pitch and yaw based on mouse movement
        pYang += newX * turnSpeed / 2;
        pXang += newY * turnSpeed / 2;
    }
    
    return(        
        <main
            className={`${dark ? "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-full h-[1000px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>3D engine</h1>
            <canvas
                id="Canvas"
                className={`${dark ? "border-white border" : "border-black border shadow-black shadow-2xl"} bg-white`}
                height={__init__.height}
                width={__init__.width}
            />
        </main>)
}