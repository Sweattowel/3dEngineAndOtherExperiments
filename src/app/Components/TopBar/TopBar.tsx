'use client';

const links: string[] = [
  'Home',
  'Profile',
  'Login',
  'Market',
];

interface TopBarProps {
  dark: boolean;
  onThemeChange: (theme: boolean) => void;
}
import { Button, ButtonGroup, Switch } from "@mui/material";

export default function TopBar({ dark, onThemeChange }: TopBarProps) {
  return (
    <main
      className={`${
        dark
          ? 'bg-black text-white shadow-lg shadow-white border border-white'
          : 'bg-white text-black shadow-lg shadow-black border border-black'
      } flex justify-evenly items-center p-2 rounded`}
    >
      <section>
        <h1 className="font-bold font-serif">Public API Test</h1>
        <div
            className="flex items-center justify-evenly"
        >
            <Switch onClick={() => onThemeChange(!dark)} defaultChecked/>
            <p>{dark ? "Dark" : "Light"}</p>
        </div>
        
      </section>

      <ButtonGroup className={`flex`}>
        {links.map((link: string, index: number) => (
            <Button 
                className={`flex ${!dark ? "border-black text-black hover:text-white hover:bg-black" : "border-white text-white hover:text-black hover:bg-white"}`}
                key={index}>
                {link}
            </Button>
        ))}
      </ButtonGroup>
    </main>
  );
}
