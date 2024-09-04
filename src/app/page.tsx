'use client';
import { useEffect, useState } from 'react';
import TopBar from './Components/TopBar/TopBar';
import Posts from './Components/Bengal/Posts';
import TwoDEngine from './Components/CustomBuilt/TwoDEngine';
import ThreeDEngine from './Components/CustomBuilt/ThreeDEngine';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <main
      className={`${
        darkMode
          ? 'bg-black text-white shadow-2xl shadow-white'
          : 'bg-white text-black'
      } min-h-[100vh] min-w-[98vw] p-4`}
    >
      <TopBar onThemeChange={setDarkMode} dark={darkMode} />

      <ThreeDEngine dark={darkMode} />
       
    </main>
  );
}
/*
      <div 
        className='flex justify-evenly items-center'  
      >
        <Posts dark={darkMode} />
        <Flappy dark={darkMode} />
        <MathTest dark={darkMode} />
        <DoomFollow dark={darkMode} />
      </div>

      Custom built engines
      <TwoDEngine dark={darkMode} />
*/