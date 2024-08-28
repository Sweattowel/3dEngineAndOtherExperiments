import { useEffect, useState } from "react";

interface importStruc {
    dark: boolean;
}

export default function TwoDEngine( { dark }: importStruc){
    let left = false;
    let up = false;
    let right  = false;
    let down = false;
    let turning = false;
    const canvasSize = {
        height: 800,
        width: 800
    }
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;

    let pxyz = [canvasSize.width / 2, canvasSize.height / 2, 1]
    let fpang = 0
    const fps = 60
    const scale = 4
    useEffect(() => {
        setInterval(gameLoop, 1000 / fps)
        window.addEventListener("keydown", (e) => keyDown(e))
        window.addEventListener("keyup", (e) => keyUp(e))
    },[])
    function keyDown(evt: KeyboardEvent) {
        switch (evt.keyCode) {
            case 37: left = true; break;
            case 38: up = true; break;
            case 39: right = true; break;
            case 40: down = true; break;
            case 77: turning = true; console.log("turning"); break;
        }
    }

    function keyUp(evt: KeyboardEvent) {
        switch (evt.keyCode) {
            case 37: left = false; break;
            case 38: up = false; break;
            case 39: right = false; break;
            case 40: down = false; break;
            case 77: turning = false; break;
        }
    }
    function controlLogic(){
        let playerSpeed = 4;
        let turnSpeed = 0.01
        if (up && !turning) {
            pxyz[0] -= Math.sin(fpang) * playerSpeed
            pxyz[1] -= Math.cos(fpang) * playerSpeed
        }
        if (down && !turning) {
            pxyz[0] += Math.sin(fpang) * playerSpeed
            pxyz[1] += Math.cos(fpang) * playerSpeed
        }
        if (left && !turning) {
            pxyz[0] -= Math.cos(fpang) * playerSpeed
            pxyz[1] += Math.sin(fpang) * playerSpeed
        }
        if (right && !turning) {
            pxyz[0] += Math.cos(fpang) * playerSpeed
            pxyz[1] -= Math.sin(fpang) * playerSpeed
        }

        if (left && turning) {fpang += turnSpeed}
        if (right && turning) {fpang -= turnSpeed}
    }
    
    const squares = [
        [
            [200,300,1],[300,300,1],
            [200,200,1],[300,200,1]            
        ],
        [
            [400,500,1],[500,500,1],
            [400,400,1],[500,400,1]            
        ],
    ]
    function gameLoop(){
        clearRect();
        controlLogic();
        draw();

    }
    function draw(){
        const centerX = canvasSize.width / 2;
        const centerY = canvasSize.height / 2;

        for(let square of squares){
            for (let [x1,y1,z1] of square){
                // Translate square coordinates relative to the center of the canvas
                let x1Diff = x1 - pxyz[0];
                let y1Diff = y1 - pxyz[1];

                // Apply 2D rotation around the center of the canvas
                let translatedX1 = x1Diff * Math.cos(fpang) - y1Diff * Math.sin(fpang);
                let translatedY1 = x1Diff * Math.sin(fpang) + y1Diff * Math.cos(fpang);

                // Translate back to the canvas
                let displayX1 = translatedX1 + centerX;
                let displayY1 = translatedY1 + centerY;

                pixel(displayX1, displayY1);                
            }
        }

        // Draw the player at the center (optional if you want to represent the player)
        pixel(centerX, centerY);        
        pixel(centerX, centerY + 1);        
        pixel(centerX + 1, centerY);        
        pixel(centerX + 1, centerY + 1);        
    }
    function clearRect(){
        const canvas = document.getElementById("Canvas")
        const ctx = canvas!.getContext("2d")
        ctx.fillStyle = "#000"
        ctx.fillRect(0,0,canvasSize.width, canvasSize.height)
        ctx.fillStyle = "#FFF"
    }
    function pixel(x : number, y : number){
        const canvas = document.getElementById("Canvas")
        const ctx = canvas!.getContext("2d")
        ctx.fillStyle = "#FFF"
        ctx.fillRect(x,y,scale,scale)
    }
    const [velocity, setVelocity] = useState([0,0,0])
    useEffect(() => {
        setVelocity([pxyz[0],pxyz[1],fpang])
    },[pxyz])
    return (
        <main
            className={`${dark ? "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-full h-[1000px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>2D engine</h1>
            <canvas
                id="Canvas"
                className={`${dark ? "border-white border" : "border-black border shadow-black shadow-2xl"} bg-white`}
                height={canvasSize.height}
                width={canvasSize.width}
            />
            <p>
                {velocity}
            </p>
        </main>
    )    
}