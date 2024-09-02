import { useEffect } from "react"
import {translate, rotate_x, rotate_y, rotate_z, scale, matmul, crossProduct} from './Parts/HelperFunctions'
import { objects, WORLD } from "./Data/ShapeFolder"
import {clipTriangleToNearPlane} from "./Parts/ClipAndInter"

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
        5,
    ]
    let pYang = 0.0;
    let pXang = 0.0;
    let pZang = 0.0

    let paused = true;

    useEffect(() => {
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        setInterval(gameLoop, 1000 / __init__.fps)

        // Add control event listeners
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
        window.addEventListener("pointermove", (e) => pointerMove(e))
        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock();
          });
    },[])

    function gameLoop(){
        drawQueue = []
        clearRect()
        controlLogic();
        //for (const obj of _obj){
        //    drawTriangles(obj);
        //}
        if (!paused){
            drawTriangles(objects[0].triangleCoordinates, objects[0].faceCoordinates)
            drawTriangles(WORLD[0].triangleCoordinates, WORLD[0].faceCoordinates)
            
        }
    }
    
    function drawTriangles(triangleCoordinates: number[][], faceCoordinates: number[][]) {
        const centerX = 400, centerY = 400;
        const perspective = 400;
        const nearPlane = 0.1;
    
        for (const face of faceCoordinates) {
            // Process each face which is a series of indices
            for (let i = 0; i < face.length; i += 4) {
                const i1 = face[i] - 1;    // Convert 1-based index to 0-based
                const i2 = face[i + 1] - 1;
                const i3 = face[i + 2] - 1;
                
                // Access vertices from triangleCoordinates
                const [x1, y1, z1, w1] = triangleCoordinates[i1];
                const [x2, y2, z2, w2] = triangleCoordinates[i2];
                const [x3, y3, z3, w3] = triangleCoordinates[i3];
    
                // Apply transformations (rotation, translation)
                const p1 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x1 - pxyz[0], y1 - (y1 * 2) - pxyz[1], z1 - pxyz[2], w1])));
                const p2 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x2 - pxyz[0], y2 - (y2 * 2) - pxyz[1], z2 - pxyz[2], w2])));
                const p3 = matmul(rotate_z(pZang), matmul(rotate_x(pXang), matmul(rotate_y(pYang), [x3 - pxyz[0], y3 - (y3 * 2) - pxyz[1], z3 - pxyz[2], w3])));
                
                let avgZ = (p1[2] + p2[2] + p3[2]) / 3;
                // Check if the triangle is facing the player
                if (crossProduct([p1, p2, p3], pxyz) < 0.0 || avgZ > 50 ) {
                    continue; 
                }                    
            

    
                // Clip the triangles to the near plane
                const clippedTriangles = clipTriangleToNearPlane([p1, p2, p3], nearPlane);
    
                for (const clippedTriangle of clippedTriangles) {
                    const [trans1, trans2, trans3] = clippedTriangle;
    
                    // Project the points to 2D space
                    const dis1X = (trans1[0] / trans1[2]) * perspective + centerX;
                    const dis1Y = (trans1[1] / trans1[2]) * perspective + centerY;
    
                    const dis2X = (trans2[0] / trans2[2]) * perspective + centerX;
                    const dis2Y = (trans2[1] / trans2[2]) * perspective + centerY;
    
                    const dis3X = (trans3[0] / trans3[2]) * perspective + centerX;
                    const dis3Y = (trans3[1] / trans3[2]) * perspective + centerY;
    
                    // Calculate average Z depth for sorting
                    const zAverage = (trans1[2] + trans2[2] + trans3[2]) / 3;
                    drawQueue.push([dis1X, dis1Y, dis2X, dis2Y, dis3X, dis3Y, zAverage]);
                }
            }
        }
        drawInOrder();
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
    function pixel(x: number, y: number){
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        if (ctx){
            ctx?.fillRect(x,y,__init__.scale,__init__.scale)

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
            case 16: playerSpeed = 0.20; break;

            // toggles
            case 80: paused = !paused; break;
        
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
            case 16: playerSpeed = 0.03; break;
        }
    }
    let turnSpeed = 0.03;
    let playerSpeed = 0.03;

    function controlLogic() {
        //playerSpeed = playerSpeed + factor
        if(!paused){
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

    }
    let prevMouseX = 0;
    let prevMouseY = 0;

    function pointerMove(e: PointerEvent) {
        if (!paused){
            const newX = e.movementX;
            const newY = e.movementY;
        
            // Update pitch and yaw based on mouse movement 
            // TODO: Give max up and down angle so that we dont go into vertical circles and lose proper orientation
            //pXang = Math.max(newX * turnSpeed / 2, 90)
            pYang += newX * turnSpeed / 2 //+ prevMouseY;
            pXang += newY * turnSpeed / 2 //+ prevMouseX;
            prevMouseX = newX;
            prevMouseY = newY;            
        }

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