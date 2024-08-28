import { useEffect, useState } from "react";

interface importStruc {
    dark: boolean;
}

interface imageStruc {
    id: string;
    url: string;
    width: number;
    height: number;
}

export default function Posts({ dark }: importStruc) {
    // Image collection and setting
    const [bengalImages, setBengalImages] = useState<imageStruc[]>([]);

    const API = process.env.NEXT_PUBLIC_DOG_API_KEY;

    const collectImages = async () => {
        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=beng&api_key=${API}`);
            const data = await response.json();
            setBengalImages(data);
            // console.log(data);
        } catch (error) {
            console.log("Error collecting images", error);
        }
    };

    useEffect(() => {
        collectImages();
    }, []);

    // Image position handling
    const [imageIndex, setImageIndex] = useState(0);    

    const handlePrevClick = () => {
        setImageIndex((prevIndex) => (prevIndex === 0 ? bengalImages.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setImageIndex((prevIndex) => (prevIndex === bengalImages.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <main
            className={`${dark ? "border border-white text-white bg-black shadow-lg shadow-white" : 
                "border border-black text-black bg-white shadow-lg shadow-black"}
                rounded p-2 mt-2 w-[350px] h-[500px] flex flex-col justify-center items-center relative
            `}
        >
            <h1>Bengal images</h1>
            <div className="overflow-hidden flex justify-center items-center relative h-full w-full">
                <button
                    onClick={handlePrevClick}
                    className="absolute left-0 bottom-2 rounded-lg z-10 bg-black p-2 w-[40px] hover:opacity-100 opacity-40 flex items-center justify-center"
                >
                    Left
                </button>
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${imageIndex * 100}%)` }}>
                    {bengalImages.map((image: imageStruc, index: number) => (
                        <img 
                            key={index}
                            src={image.url} 
                            alt={image.id}
                            className="min-h-full min-w-full object-cover rounded-2xl"
                        />
                    ))}
                </div>
                <button
                    onClick={handleNextClick}
                    className="absolute right-0 bottom-2 rounded-lg z-10 bg-black p-2 w-[40px] hover:opacity-100 opacity-40 flex items-center justify-center"
                >
                    Right
                </button>
            </div>
        </main>
    );
}
