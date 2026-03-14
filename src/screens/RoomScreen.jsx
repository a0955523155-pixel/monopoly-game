import React, { useRef } from 'react';
import { LogOut, Crown, Check, PlayCircle, ImagePlus } from 'lucide-react';
import { AVATARS } from '../constants/gameData';

export default function RoomScreen({ 
    gameState, user, updateGame, 
    setActiveRoomId, setGameState, 
    handleRollOrder, isRolling 
}) {
    const fileInputRef = useRef(null);

    // 🌟 圖片自動壓縮與轉換 Base64 邏輯
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 120; // 壓縮大小避免 Firebase 爆掉
                let width = img.width;
                let height = img.height;
                if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
                else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                if(myPlayer.uid) {
                    updateGame({players: gameState.players.map(p => p.uid === user.uid ? {...p, avatar: 'custom', customAvatarUrl: dataUrl} : p)});
                }
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    };

    if (gameState.status === 'DETERMINE_ORDER') {
        const rolls = gameState.orderRolls || [];
        const myRoll = rolls.find(r => r.uid === user.uid);
        return (
            <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-black mb-4">擲骰決定順序</h2>
                    {!myRoll ? (
                        <button onClick={handleRollOrder} disabled={isRolling} className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-600 transition-colors shadow-lg">
                            {isRolling ? '擲骰中...' : '點擊擲骰'}
                        </button>
                    ) : (
                        <div className="text-2xl font-black text-blue-600 mb-4 bg-blue-50 py-3 rounded-xl border border-blue-200">您擲出 {myRoll.val} 點</div>
                    )}
                    <div className="mt-6 space-y-2 text-left border-t border-gray-100 pt-4">
                        {rolls.map((r, i) => (
                            <div key={i} className="flex justify-between font-bold text-gray-600">
                                <span>{r.name}</span><span className="text-blue-500">{r.val} 點</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const myPlayer = gameState.players.find(p => p.uid === user.uid) || {};
    const amIReady = !!myPlayer.isReady;
    const isHost = gameState.host === user.uid;
    const allReady = gameState.players.length >= 2 && gameState.players.every(p => p.isReady);

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md relative">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <div className="text-xs text-gray-400 font-bold tracking-wider">ROOM ID</div>
                        <h2 className="text-3xl font-black text-indigo-600">{gameState.roomId}</h2>
                    </div>
                    <button onClick={() => { setActiveRoomId(null); setGameState(null); }} className="text-red-500 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 flex items-center gap-1">
                        <LogOut size={16}/> 離開
                    </button>
                </div>

                <div className="mb-6">
                    <div className="text-sm font-bold text-gray-500 mb-2">選擇代表物或自訂圖片</div>
                    <div className="grid grid-cols-4 gap-3">
                        {/* 自訂上傳按鈕 */}
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current.click()} className={`p-2 border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${myPlayer.avatar === 'custom' ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-105' : 'border-gray-200 hover:border-gray-400 bg-gray-50'}`}>
                            {myPlayer.avatar === 'custom' && myPlayer.customAvatarUrl ? (
                                <img src={myPlayer.customAvatarUrl} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-indigo-400" alt="custom" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center"><ImagePlus size={20}/></div>
                            )}
                        </button>

                        {AVATARS.map(ava => {
                            const isTaken = gameState.players.some(p => p.avatar === ava.id && p.uid !== user.uid);
                            const isMine = myPlayer.avatar === ava.id;
                            const Icon = ava.icon;
                            return (
                                <button key={ava.id} onClick={() => { if(myPlayer.uid) updateGame({players: gameState.players.map(p => p.uid === user.uid ? {...p, avatar: ava.id} : p)})}} disabled={isTaken} className={`p-2 border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${isMine ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-105' : 'border-gray-100 hover:border-gray-300'} ${isTaken ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full ${ava.color} text-white flex items-center justify-center shadow-inner`}><Icon size={20}/></div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-sm font-bold text-gray-500 mb-3 flex justify-between">
                        <span>玩家列表 ({gameState.players.length}/6)</span>
                        {allReady && <span className="text-green-500 flex items-center gap-1"><Check size={14}/> 準備完畢</span>}
                    </div>
                    <div className="space-y-2">
                        {gameState.players.map(p => (
                            <div key={p.uid} className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-50">
                                <span className={`w-3 h-3 rounded-full ${p.isReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}/>
                                <span className="font-bold text-gray-700 flex-1 truncate">{p.name}</span>
                                {p.uid === gameState.host && <Crown size={16} className="text-yellow-500"/>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button onClick={() => { if(myPlayer.uid) updateGame({players: gameState.players.map(p => p.uid === user.uid ? {...p, isReady: !p.isReady} : p)}) }} className={`flex-1 py-4 text-white rounded-xl font-black text-lg transition-all active:scale-95 ${amIReady ? 'bg-orange-400 hover:bg-orange-500 shadow-orange-200' : 'bg-gray-800 hover:bg-gray-900 shadow-gray-300'} shadow-lg`}>
                        {amIReady ? '取消準備' : '準備'}
                    </button>
                    {isHost && (
                        <button onClick={() => updateGame({status: 'DETERMINE_ORDER', orderRolls: []})} disabled={!allReady} className="flex-[1.5] bg-green-500 text-white rounded-xl font-black text-lg disabled:opacity-50 hover:bg-green-600 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                            <PlayCircle size={20}/> 開始
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}