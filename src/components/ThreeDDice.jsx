import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

export default function ThreeDDice({ value, rolling }) {
  return (
    <div className="scene w-12 h-12 md:w-16 md:h-16">
      <div className={`cube w-full h-full relative ${rolling ? 'rolling' : `show-${value || 1}`}`}>
        <div className="cube__face cube__face--1 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice1 size="80%" className="text-red-500"/></div>
        <div className="cube__face cube__face--2 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice2 size="80%" className="text-blue-600"/></div>
        <div className="cube__face cube__face--3 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice3 size="80%" className="text-blue-600"/></div>
        <div className="cube__face cube__face--4 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice4 size="80%" className="text-red-500"/></div>
        <div className="cube__face cube__face--5 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice5 size="80%" className="text-blue-600"/></div>
        <div className="cube__face cube__face--6 flex justify-center items-center bg-white border-2 border-gray-300 rounded shadow-inner"><Dice6 size="80%" className="text-blue-600"/></div>
      </div>
      <style>{`
        .scene { perspective: 400px; }
        .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transform: translateZ(-24px); transition: transform 1s; }
        .cube__face { position: absolute; width: 100%; height: 100%; line-height: 100px; font-size: 40px; font-weight: bold; color: white; text-align: center; backface-visibility: hidden; background: white;}
        .cube__face--1  { transform: rotateY(  0deg) translateZ(24px); }
        .cube__face--2  { transform: rotateY(180deg) translateZ(24px); }
        .cube__face--3  { transform: rotateY( 90deg) translateZ(24px); }
        .cube__face--4  { transform: rotateY(-90deg) translateZ(24px); }
        .cube__face--5  { transform: rotateX( 90deg) translateZ(24px); }
        .cube__face--6  { transform: rotateX(-90deg) translateZ(24px); }
        @media (min-width: 768px) {
           .cube { transform: translateZ(-32px); }
           .cube__face--1  { transform: rotateY(  0deg) translateZ(32px); }
           .cube__face--2  { transform: rotateY(180deg) translateZ(32px); }
           .cube__face--3  { transform: rotateY( 90deg) translateZ(32px); }
           .cube__face--4  { transform: rotateY(-90deg) translateZ(32px); }
           .cube__face--5  { transform: rotateX( 90deg) translateZ(32px); }
           .cube__face--6  { transform: rotateX(-90deg) translateZ(32px); }
        }
        .cube.show-1  { transform: translateZ(-24px) rotateY(   0deg); }
        .cube.show-2  { transform: translateZ(-24px) rotateY( 180deg); }
        .cube.show-3  { transform: translateZ(-24px) rotateY( -90deg); }
        .cube.show-4  { transform: translateZ(-24px) rotateY(  90deg); }
        .cube.show-5  { transform: translateZ(-24px) rotateX( -90deg); }
        .cube.show-6  { transform: translateZ(-24px) rotateX(  90deg); }
        @media (min-width: 768px) {
            .cube.show-1  { transform: translateZ(-32px) rotateY(   0deg); }
            .cube.show-2  { transform: translateZ(-32px) rotateY( 180deg); }
            .cube.show-3  { transform: translateZ(-32px) rotateY( -90deg); }
            .cube.show-4  { transform: translateZ(-32px) rotateY(  90deg); }
            .cube.show-5  { transform: translateZ(-32px) rotateX( -90deg); }
            .cube.show-6  { transform: translateZ(-32px) rotateX(  90deg); }
        }
        .cube.rolling { animation: spin 0.5s infinite linear; }
        @keyframes spin { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); } }
      `}</style>
    </div>
  );
}