import React, { useState, useEffect } from 'react';
import { BOARD_SIZE, AVATARS } from '../constants/gameData';

export default function PlayerToken({ player, index, totalPlayers }) {
  const targetPos = player.pos;
  const [currentPos, setCurrentPos] = useState(targetPos || 0);
  const avatar = AVATARS.find(a => a.id === player.avatar) || AVATARS[0];
  const Icon = avatar.icon;

  useEffect(() => {
    if (currentPos === targetPos) return;
    const diff = (targetPos - currentPos + BOARD_SIZE) % BOARD_SIZE;
    if (diff > 12) { setCurrentPos(targetPos); return; }
    const timer = setTimeout(() => setCurrentPos((prev) => (prev + 1) % BOARD_SIZE), 150);
    return () => clearTimeout(timer);
  }, [targetPos, currentPos]);

  let row = 1, col = 1;
  const pos = currentPos || 0;
  if (pos >= 0 && pos <= 9) { row = 10; col = 10 - pos; }
  else if (pos >= 10 && pos <= 17) { row = 10 - (pos - 9); col = 1; }
  else if (pos >= 18 && pos <= 27) { row = 1; col = pos - 17; }
  else if (pos >= 28 && pos <= 35) { row = pos - 26; col = 10; }

  const offset = totalPlayers > 1 ? (index - (totalPlayers - 1) / 2) * 4 : 0;

  return (
    <div className="absolute z-20 transition-transform duration-300 ease-in-out pointer-events-none" style={{ gridRowStart: row, gridColumnStart: col, transform: `translate(${offset}px, ${offset}px)` }}>
      <div className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white overflow-hidden ${player.avatar === 'custom' ? 'bg-gray-300' : avatar.color}`}>
        {player.avatar === 'custom' && player.customAvatarUrl ? (
            <img src={player.customAvatarUrl} className="w-full h-full object-cover" alt="avatar" />
        ) : (
            <Icon size={12} />
        )}
      </div>
    </div>
  );
}