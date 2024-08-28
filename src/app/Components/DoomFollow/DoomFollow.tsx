import { useEffect } from "react";

interface importStruc {
    dark: boolean;
}

export default function DoomFollow({ dark }: importStruc) {
    const canvasHeight = 800;
    const canvasWidth = 800;

    let up = false;
    let down = false;
    let left = false;
    let right = false;
    let turning = false;
    let strafing = false;
    let playerX = 50;
    let playerY = 50;
    let playerZ = -150;
    let playerOne = 0;
    let fpang = 0;

    const fps = 60;

    useEffect(() => {
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        ctx?.fillRect(0,0,canvasHeight,canvasWidth)


        window.setInterval(gameLoop, 1000 / fps);
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

    }, []);
    
    function gameLoop(){
        const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        
        clearBackground(ctx!);
        controlLogic();
        draw3D(ctx!);
    };

    function pixel(ctx: CanvasRenderingContext2D, x: number, y: number, colour: string) {
        ctx.beginPath()
        ctx.fillStyle = "#FFF"
       // ctx.fillStyle = colour;
        ctx.fillRect(x, y, 4, 4);
    }

    function clearBackground(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Clear entire canvas
        ctx.fillStyle = "#FFF"
    }

    function draw3D(ctx: CanvasRenderingContext2D) {
        const CS = Math.cos(fpang);
        const SN = Math.sin(fpang);

        const wX = [], wY = [], wZ = [];

        const x1 = 400 - playerX;
        const x2 = 400 - playerX;

        const y1 = 10 - playerY;
        const y2 = 290 - playerY;
        
        const z1 = 0 - playerY;
        const z2 = 50 - playerY;

        wX[0] = x1 * CS - y1 * SN;
        wX[1] = x2 * CS - y2 * SN;
        wY[0] = y1 * CS + x1 * SN;
        wY[1] = y2 * CS + x2 * SN;

        wZ[0] = 0 - playerZ + ((playerOne * wY[0]) / 32.0);
        wZ[1] = 0 - playerZ + ((playerOne * wY[1]) / 32.0);

        wX[0] = wX[0] * 200 / wY[0] + canvasWidth / 2;
        wX[1] = wX[1] * 200 / wY[1] + canvasWidth / 2;
        wY[0] = wZ[0] * 200 / wY[0] + canvasHeight / 2;
        wY[1] = wZ[1] * 200 / wY[1] + canvasHeight / 2;
        /*
        for (let i = wX[0]; i < wX[1]; i++){
            for (let j = wY[0]; j < wY[1]; j++){
                pixel(ctx, i, j, '#')
            }
        }
        */
        if (wX[0] > 0 && wX[0] < canvasWidth && wY[0] > 0 && wY[0] < canvasHeight && wZ[0] > playerY){
            pixel(ctx, wX[0], wY[0], "#000000");
        }
        if (wX[0] > 0 && wX[0] < canvasWidth && wY[1] > 0 && wY[1] < canvasHeight && wZ[0] > playerY){
            pixel(ctx, wX[0], wY[1], "#000000");
        }
        if (wX[1] > 0 && wX[1] < canvasWidth && wY[0] > 0 && wY[0] < canvasHeight && wZ[0] > playerY){
            pixel(ctx, wX[1], wY[0], "#000000");
        }
        if (wX[1] > 0 && wX[1] < canvasWidth && wY[1] > 0 && wY[1] < canvasHeight && wZ[0] > playerY){
            pixel(ctx, wX[1], wY[1], "#000000");
        }
        
        
        
        
        //(ctx, wZ[0], wY[0], "#000000");
        //pixel(ctx, wZ[0], wZ[0], "#000000");
    }

    function keyDown(evt: KeyboardEvent) {
        console.log(evt)
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

    function controlLogic() {
        const speed = 3;
        const turnSpeed = 4;

        
        if (left && !turning) { fpang -= 4; if (fpang < 0){ fpang += 360}}
        if (right && !turning) { fpang += 4; if (fpang > 359){ fpang -= 360}}

        const dX = Math.sin(fpang) * 10.0;
        const dY = Math.cos(fpang) * 10.0;      
        if (up && !turning) { playerX += dX; playerY += dY }
        if (down && !turning) { playerX -= dX; playerY -= dY }  

        if ( right && !turning && strafing) { playerX += dY; playerY -= dX }   
        if ( left && !turning && strafing) { playerX -= dY; playerY += dX }
        
        if (left && turning) { playerOne -= turnSpeed }
        if (right && turning) { playerOne += turnSpeed }
        if (up && turning) { playerZ -= turnSpeed }
        if (down && turning) { playerZ += turnSpeed }
        
        
    }

    return (
        <main
            className={`${dark ? "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-full h-[1000px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>Hard to follow Doom tut, will focus on writing purely by myself</h1>
            <canvas
                id="Canvas"
                className={`${dark ? "border-white border" : "border-black border shadow-black shadow-2xl"} bg-white`}
                height={canvasHeight}
                width={canvasWidth}
            />
        </main>
    );
}
