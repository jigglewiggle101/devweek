/* eslint-disable @next/next/no-img-element */
'use client';

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Main() {
    const insertAdventure = useMutation(api.adventure.insertAdventure);
    const router = useRouter();
    const [selectedCharacter, setSelectedCharacter] = useState("wizard");
     

    return (
     <div className="flex justify-center items-center w-full h-screen font-chakra flex-col gap-8">
      <h1 className="text-4xl text-white">
        Welcome to the Text Based Hogwarts Game
      </h1>

      <div className="grid grid-cols-3 gap-8">
    {["", "wizard", ""].map((character, index) => {
        return (
            <div
                key={index}
                className="flex flex-col items-center gap-2 text-2xl"
            >
                <img
                    onClick={() => setSelectedCharacter(character)}
                    src={`/${character}.png`}
                    alt=""
                    className={
                        selectedCharacter === character ? "border border-white" : ""
                    }
                />
                {character}
            </div>
        );
    })}
</div>

 {/* Add the image above the button */}
 <img
                src='/wizard.avif'
                alt="Your Image Alt Text"
                className="mt-4"  // Add margin top for spacing
            />



     <button
        className="bg-gray-500 hover:bg-gray-400 px-2 py-1 rounded-md"
     onClick={async() => {
     const advid = await insertAdventure()
     router.push(`/adventure/${advid}`);


     }}
     >Start Our lovemesomeadventure</button>
    </div>
    );
}