import { useEffect, useRef, useState } from "react";

interface ImportStruc {
    dark: boolean;
}

export default function Flappy({ dark }: ImportStruc) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scale, setScale] = useState(5);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    function draw() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.moveTo(centerX, centerY);

        for (let i = 0; i < 10000; i += 10) {
            const theta = i * 0.01;
            const r = scale * theta;
            const x = centerX + r * Math.cos(theta);
            const y = centerY + r * Math.sin(theta);

            context.lineTo(x, y);
        }

        context.strokeStyle = 'black';
        context.stroke();
    }

    function startIncrease() {
        clearInterval(intervalRef.current!);
        intervalRef.current = setInterval(() => {
            setScale((prevScale) => Math.min(1000, prevScale + 0.1));
        }, 100);
    }

    function startDecrease() {
        clearInterval(intervalRef.current!);
        intervalRef.current = setInterval(() => {
            setScale((prevScale) => Math.max(0, prevScale - 0.1));
        }, 100);
    }

    function stopChange() {
        clearInterval(intervalRef.current!);
    }

    useEffect(() => {
        draw();
    }, [scale]);

    return (
        <main
            className={`${dark ? 
                "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-full h-[500px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>
                Canvas Spiral
            </h1>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border bg-white"
            />
            <div className="flex w-full justify-evenly mt-4">
                <button
                    onPointerDown={startDecrease}
                    onPointerUp={stopChange}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Decrease
                </button>
                <p>{scale.toFixed(2)}</p>
                <button
                    onPointerDown={startIncrease}
                    onPointerUp={stopChange}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Increase
                </button>
            </div>
        </main>
    );
}
