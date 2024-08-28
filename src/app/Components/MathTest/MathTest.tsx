import { useEffect, useRef } from "react";

interface importStruc {
    dark: boolean;
}

export default function MathTest({ dark }: importStruc) {


    const fps = 1000 / 60;
    let playerX = 100;
    let playerY = 100;
    let playerH = 50;
    let playerW = 50;
    
    let up = false;
    let down = false;
    let right = false;
    let left = false;

    let fxyz = [400, 0, 300];
    let fpang = 0;

    let walls = [
        [300, 300, 100, 100],
        [600, 100, 50, 350],
        [200, 500, 450, 50],
    ]



    const speed = 1;
    const turnSpeed =  (Math.PI / 180) * 1;

    useEffect(() => {
            
        const canvas = document.getElementById("Canvas")
        const ctx = canvas.getContext('2d')
        
        // begin gameloop on mount
        gameLoop();
        console.log("Begining gameloop")
        window.addEventListener("keydown", (e) => keydown(e))
        window.addEventListener("keyup", (e) => keyup(e))
        setInterval(gameLoop, fps)
    }, []);  

    function gameLoop(){
        //draw();
        paintScreen();
        controlLogic();
    }

    function minMax(val : number, min : number, max : number){
        return Math.min(Math.max(min,val), max)
    }

    function fpDrawPillars(prX : number, prY : number, prZ : number, prW : number, prH : number, prL : number) {
        let propEnds = 0.03;
        let propIn = 0.66;

        let playerHeight = 100;
        prY = playerHeight - prH - prY;

        drawPrism(prX, prY, prZ, prW, prH * propEnds, prL);
        drawPrism(prX + prW * (1 - propIn) / 2, prY + prH * propEnds, prZ + prL * (1 - propIn) / 2, prW * propIn, prH - prH * propEnds, prL * propIn);
        drawPrism(prX, prY + prH - prH * propEnds, prZ, prW, prH * propEnds, prL);
    }

    function drawPrism(prX: number, prY: number, prZ: number, prW: number, prH: number, prL: number){
        draw3dLine(prX, prY, prZ, prX, prY, prZ + prL);
        draw3dLine(prX, prY, prZ, prX, prY + prH, prZ);
        draw3dLine(prX, prY + prH, prZ, prX, prY + prH, prZ + prL);
        draw3dLine(prX, prY, prZ + prL, prX, prY + prH, prZ + prL);
    
        draw3dLine(prX + prW, prY, prZ, prX + prW, prY, prZ + prL);
        draw3dLine(prX + prW, prY, prZ, prX + prW, prY + prH, prZ);
        draw3dLine(prX + prW, prY + prH, prZ, prX + prW, prY + prH, prZ + prL);
        draw3dLine(prX + prW, prY, prZ + prL, prX + prW, prY + prH, prZ + prL);
    
        draw3dLine(prX, prY, prZ, prX + prW, prY, prZ);
        draw3dLine(prX, prY + prH, prZ, prX + prW, prY + prH, prZ);
        draw3dLine(prX, prY, prZ + prL, prX + prW, prY, prZ + prL);
        draw3dLine(prX, prY + prH, prZ + prL, prX + prW, prY + prH, prZ + prL);

    }
    function draw3dLine(x1: number,y1: number,z1: number,x2: number,y2: number,z2: number){
        const canvas = document.getElementById("Canvas")
        const ctx = canvas.getContext('2d')
        let prCoor = [ x1, y1 ,z1, x2, y2, z2]
        let prDiff = []
        // var sd = 400;

        for (let i = 0; i < 6; i++){
            prDiff[i] = prCoor[i] - fxyz[i % 3];
        }

        let dispCoor = [];

        for (let i = 0; i < 2; i++){
            let transX = prDiff[i * 3] * Math.cos(-fpang) + prDiff[ i * 3 + 2] * Math.sin(-fpang)
            let transY = prDiff[i * 3 + 1]
            let transZ = prDiff[i * 3 + 2] * Math.cos(-fpang) - prDiff[ i * 3] * Math.sin(-fpang)

            /*
            if (transZ < 40 || transZ > 2000){
                return;
            }*/
            dispCoor[ i * 2] = minMax(transX + 400, -200, 1000);
            dispCoor[ i * 2 + 1] = minMax(-transZ + 300, -200, 1000)
        }
        ctxDrawLine(dispCoor[0], dispCoor[1], dispCoor[2], dispCoor[3]);
        ctx.fillRect(390,290,20,20);
    }   
    function ctxDrawLine(x1: number,y1: number,x2: number,y2: number){
        const canvas = document.getElementById("Canvas")
        const ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }    
    function controlLogic()
    {
        var walkSpd = 3;
        var turnSpd = 0.03;
    
        if (up)
        {
            fxyz[0] += Math.sin(fpang) * walkSpd;
            fxyz[2] += Math.cos(fpang) * walkSpd;
        }
        else if (down)
        {
            fxyz[0] -= Math.sin(fpang) * walkSpd;
            fxyz[2] -= Math.cos(fpang) * walkSpd;
        }
    
        if (right)
        {
            fpang += turnSpd;
        }
        else if (left)
        {
            fpang -= turnSpd;
        }
    }
    
    function keydown(evt)
    {
        switch(evt.keyCode)
        {
            case 37: left = true; break;
            case 38: up = true; break;
            case 39: right = true; break;
            case 40: down = true; break;
        }
    }
    
    function keyup(evt: any)
    {
        switch(evt.keyCode)
        {
            case 37: left = false; break;
            case 38: up = false; break;
            case 39: right = false; break;
            case 40: down = false; break;
        }
    }

    function paintScreen(){
        const canvas = document.getElementById("Canvas")
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#696';
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = "#000"

        for (let i = 0; i < 8; i++){
            fpDrawPillars(550, 0, 200 + 400 * i, 50, 300, 50)
            fpDrawPillars(200, 0, 200 + 400 * i, 50, 300, 50)
        }
    }



    /*
    function collisionCheck(x1: number, y1: number, w1: number, h1: number){
        for (const square of squares){
            let x2 = square[0],y2 = square[1], w2 = 50, h2 = 50
            if (        
                x1 < x2 + w2 &&
                x1 + w1 > x2 &&
                y1 < y2 + h2 &&
                y1 + h1> y2
                ){
                    return true
                }                              
        }
        return false        
    }
    */
  

    return (
        <main
            className={`${dark ? "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-full h-[1000px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>3D Render making elseWhere and porting later if bothered</h1>
            <canvas
                id="Canvas"
                className={`${dark ? "border-white border" : "border-black border shadow-black shadow-2xl"} bg-white`}
                height={800}
                width={800}
            />

        </main>
    );
}
/*




var x = 100;
var y = 100;
var vspd = 0;
var canJump = false;

var pWidth = 50;
var pHeight = 50;

var blink = 0;

var left = false;
var right = false;
var up = false;
var down = false;
var space = false;
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var fxyz = [400, 0, 300];
var fpang = 0;

var pimage = new Image(); 
pimage.src = "pimage.png";

var pimage2 = new Image(); 
pimage2.src = "pimage2.png";

var wall = [
[ 300, 300, 100, 100 ],
[ 600, 100, 50, 350],
[ 200, 500, 450, 50]
];

window.onload = function()
{
    var fps = 60;
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
	setInterval( gameloop, 1000 / fps);
}

function gameloop()
{
    gameLogic();
    paintScreen();
}

function minMax(val, min, max)
{
    return Math.min(Math.max(min, val), max);
}

function fpDrawPillar(prX, prY, prZ, prW, prH, prL)
{
	var propEnds = 0.03;
	var propIn = 0.66;

	var playerHeight = 100;
	prY = playerHeight - prH - prY;

	drawPrism(prX, prY, prZ, prW, prH * propEnds, prL);
	drawPrism(prX + prW * (1 - propIn)/2, prY + prH * propEnds, 
	    prZ + prL * (1 - propIn)/2, prW * propIn, prH - prH * propEnds, prL * propIn);
	drawPrism(prX, prY + prH - prH * propEnds, prZ, prW, prH * propEnds, prL);
}

function drawPrism(prX, prY, prZ, prW, prH, prL)
{
	draw3dLine(prX, prY, prZ, prX, prY, prZ + prL);
	draw3dLine(prX, prY, prZ, prX, prY + prH, prZ);
	draw3dLine(prX, prY + prH, prZ, prX, prY + prH, prZ + prL);
	draw3dLine(prX, prY, prZ + prL, prX, prY + prH, prZ + prL);

	draw3dLine(prX + prW, prY, prZ, prX + prW, prY, prZ + prL);
	draw3dLine(prX + prW, prY, prZ, prX + prW, prY + prH, prZ);
	draw3dLine(prX + prW, prY + prH, prZ, prX + prW, prY + prH, prZ + prL);
	draw3dLine(prX + prW, prY, prZ + prL, prX + prW, prY + prH, prZ + prL);

	draw3dLine(prX, prY, prZ, prX + prW, prY, prZ);
	draw3dLine(prX, prY + prH, prZ, prX + prW, prY + prH, prZ);
	draw3dLine(prX, prY, prZ + prL, prX + prW, prY, prZ + prL);
	draw3dLine(prX, prY + prH, prZ + prL, prX + prW, prY + prH, prZ + prL);
}

function draw3dLine(x1, y1, z1, x2, y2, z2)
{
	var prCoor = [ x1, y1, z1, x2, y2, z2 ];
	var prDiff = [];
	//var sd = 400;

	for (var i = 0; i < 6; i++)
	{
		prDiff[i] = prCoor[i] - fxyz[i % 3];
	}

	var dispCoor = [];

	for (var i = 0; i < 2; i++)
	{
		var transX = prDiff[i * 3] * Math.cos(-fpang) + prDiff[i * 3 + 2] * Math.sin(-fpang);
		var transY = prDiff[i * 3 + 1];
		var transZ = prDiff[i * 3 + 2] * Math.cos(-fpang) - prDiff[i * 3] * Math.sin(-fpang);

		if (transZ < 40 || transZ > 2000)
		{
			return;
		}

		//dispCoor[i * 2] = minMax((transX / transZ) * sd + 400, -200, 1000);
		//dispCoor[i * 2 + 1] = minMax((transY / transZ) * sd + 300, -200, 1000);
		dispCoor[i*2] = minMax(transX + 400, -200, 1000);
		dispCoor[i*2 + 1] = minMax(-transZ + 300, -200, 1000);
	}

	ctxDrawLine(dispCoor[0], dispCoor[1], dispCoor[2], dispCoor[3]);
	ctx.fillRect(390, 290, 20, 20);
}

function ctxDrawLine(x1, y1, x2, y2)
{
    ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function controlLogic()
{
    var walkSpd = 3;
	var turnSpd = 0.03;

	if (up)
	{
		fxyz[0] += Math.sin(fpang) * walkSpd;
		fxyz[2] += Math.cos(fpang) * walkSpd;
	}
	else if (down)
	{
		fxyz[0] -= Math.sin(fpang) * walkSpd;
		fxyz[2] -= Math.cos(fpang) * walkSpd;
	}

	if (right)
	{
		fpang += turnSpd;
	}
	else if (left)
	{
		fpang -= turnSpd;
	}
}

function gameLogic()
{
    controlLogic();
}

function paintScreen()
{
	ctx.fillStyle = "#696";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#000";
	for (var i = 0; i < 8; i++)
	{
		fpDrawPillar(550, 0, 200 + 400 * i, 50, 300, 50);
		fpDrawPillar(200, 0, 200 + 400 * i, 50, 300, 50);
	}
	
}
function keydown(evt)
{
	switch(evt.keyCode)
	{
	    case 37: left = true; break;
		case 38: up = true; break;
		case 39: right = true; break;
		case 40: down = true; break;
	}
}

function keyup(evt)
{
	switch(evt.keyCode)
	{
	    case 37: left = false; break;
		case 38: up = false; break;
		case 39: right = false; break;
		case 40: down = false; break;
	}
}


*/