import React, { useState, useEffect, useRef } from 'react';
import { Wifi, LogOut, Trophy, Crown, Building2, Home, Ghost, EyeOff, DollarSign, AlertOctagon, Zap, Train, MessageCircle, Gavel, Volume2, VolumeX, Info } from 'lucide-react';
import { MAP_DATA, AVATARS } from '../constants/gameData';
import ThreeDDice from '../components/ThreeDDice';
import PlayerToken from '../components/PlayerToken';

// 🌟 免費授權音效庫
const SFX = {
    roll: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
    money: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
    buy: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_18c7c2cb07.mp3', // build/buy
    error: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3'
};
const BGM_URL = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3';

export default function GameScreen({ 
    gameState, user, setActiveRoomId, setGameState, 
    rollDice, isRolling, hasRolled, handleAction, handleAuction, sendTaunt 
}) {
    let safeTurnIndex = gameState.turnIndex;
    if (safeTurnIndex < 0 || safeTurnIndex >= gameState.players.length) safeTurnIndex = 0;

    const currentPlayer = gameState.players[safeTurnIndex];
    const isMyTurn = currentPlayer.uid === user.uid;
    const currentAction = gameState.currentAction;
    const centralMsg = gameState.centralMessage;
    const props = gameState.properties || {};
    const auction = gameState.auction;

    const TAUNTS = ["太神啦！", "快點啦好嗎", "我要破產了😭", "謝謝老闆！💸"];

    const [activeTaunts, setActiveTaunts] = useState({});
    const [selectedTile, setSelectedTile] = useState(null); // 🌟 點擊地塊詳情
    const [isMuted, setIsMuted] = useState(true); // 瀏覽器預設阻擋自動播放，預設靜音

    const bgmRef = useRef(null);

    // 處理音效播放
    useEffect(() => {
        if (!isMuted && gameState.sfx && SFX[gameState.sfx]) {
            const audio = new Audio(SFX[gameState.sfx]);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio blocked', e));
        }
    }, [gameState.sfx, gameState.actionEventId, isMuted]);

    // 處理背景音樂
    useEffect(() => {
        if (bgmRef.current) {
            bgmRef.current.volume = 0.2;
            if (!isMuted) bgmRef.current.play().catch(e => console.log('BGM blocked', e));
            else bgmRef.current.pause();
        }
    }, [isMuted]);

    useEffect(() => {
        if (gameState?.taunt?.ts) {
            const { uid, text, ts } = gameState.taunt;
            setActiveTaunts(prev => ({ ...prev, [uid]: { text, ts } }));
            const timer = setTimeout(() => {
                setActiveTaunts(prev => {
                    const next = { ...prev };
                    if (next[uid]?.ts === ts) delete next[uid];
                    return next;
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState?.taunt?.ts]);

    // 計算目前地塊租金
    const calculateRent = (tileId) => {
        const tile = MAP_DATA.find(t => t.id === tileId);
        const prop = props[tileId];
        if (!prop || !tile || tile.type !== 'PROP') return 0;
        const lvl = prop.level || 0;
        if (tile.group === 'station') {
            const count = MAP_DATA.filter(t => t.group === 'station' && props[t.id]?.owner === prop.owner).length;
            return tile.rent * Math.pow(2, count - 1);
        } else if (tile.group === 'util') {
            const count = MAP_DATA.filter(t => t.group === 'util' && props[t.id]?.owner === prop.owner).length;
            return tile.rent * (count > 1 ? 2.5 : 1);
        } else {
            const multipliers = [1, 5, 15, 45, 80];
            let rent = tile.rent * multipliers[lvl];
            const groupTiles = MAP_DATA.filter(t => t.group === tile.group);
            const ownsAll = groupTiles.every(t => props[t.id]?.owner === prop.owner);
            if (ownsAll && lvl === 0) rent *= 2;
            return rent;
        }
    }

    return (
        <div className="h-[100dvh] bg-slate-100 flex flex-col md:flex-row overflow-hidden font-sans relative">
            <audio ref={bgmRef} src={BGM_URL} loop />

            {/* 🌟 修正手機版玩家列表卡住問題：設定固定高度並允許捲動 */}
            <div className="order-2 md:order-1 w-full md:w-64 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:shadow-xl flex flex-col max-h-[25vh] min-h-[120px] md:max-h-none md:h-full z-20 md:border-r flex-shrink-0">
                <div className="p-2 md:p-3 bg-slate-900 text-white flex justify-between items-center shadow-inner">
                    <span className="font-bold tracking-widest text-xs md:text-sm flex items-center gap-2"><Wifi size={14} className="text-green-400"/> #{gameState.roomId}</span>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-lg">{isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>}</button>
                        <button type="button" onClick={() => { setActiveRoomId(null); setGameState(null); }} className="text-red-400 hover:text-red-300 bg-white/10 p-1.5 rounded-lg"><LogOut size={14}/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50 relative">
                    {gameState.players.map((p, idx) => {
                        const isMe = p.uid === user.uid;
                        const isTheirTurn = safeTurnIndex === idx && gameState.status === 'PLAYING';
                        const avatarData = AVATARS.find(a => a.id === p.avatar) || AVATARS[0];
                        const Icon = avatarData.icon;
                        const tauntData = activeTaunts[p.uid];

                        return (
                            <div key={p.uid} className={`relative p-2 rounded-xl border flex justify-between items-center transition-all ${isTheirTurn ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200/50' : isMe ? 'bg-white border-gray-300' : 'bg-white border-gray-100'}`}>
                                {tauntData && (
                                    <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1.5 rounded-2xl rounded-bl-sm text-sm font-black shadow-lg z-[100] animate-bounce whitespace-nowrap">
                                        💬 {tauntData.text}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-inner relative overflow-hidden ${p.avatar === 'custom' ? 'bg-gray-200' : avatarData.color}`}>
                                        {p.avatar === 'custom' && p.customAvatarUrl ? <img src={p.customAvatarUrl} className="w-full h-full object-cover" alt="avatar" /> : <Icon size={16}/>}
                                        {isMe && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1 rounded-full border border-white">ME</div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-800 flex items-center gap-1">{p.name} {p.isBankrupt && <Ghost size={12} className="text-gray-400"/>}</span>
                                        <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${p.money < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {isMe || gameState.status === 'GAME_OVER' ? <><DollarSign size={10}/>{p.money}</> : <><EyeOff size={10} className="text-gray-400"/> ****</>}
                                        </span>
                                    </div>
                                </div>
                                {isTheirTurn && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"/>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="order-1 md:order-2 flex-1 relative bg-[#E2E8F0] h-full flex items-center justify-center p-2 overflow-hidden">
                
                <div className="absolute top-2 right-2 md:bottom-4 md:top-auto md:left-4 z-40 flex flex-wrap justify-end md:justify-start gap-2 max-w-[80%] md:max-w-none pointer-events-auto">
                    {TAUNTS.map(t => (
                        <button key={t} type="button" onClick={() => sendTaunt(t)} className="bg-white/90 backdrop-blur border border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black shadow flex items-center gap-1 active:scale-95 transition-all">
                            <MessageCircle size={12}/> {t}
                        </button>
                    ))}
                </div>

                {/* 🌟 點擊地塊詳情 Modal */}
                {selectedTile && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedTile(null)}>
                        <div className="bg-white p-6 rounded-3xl shadow-2xl text-center w-full max-w-xs border-4" style={{borderColor: selectedTile.bg?.replace('bg-','').replace('100','400') || '#cbd5e1'}} onClick={e=>e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-2">
                                <Info className="text-blue-500 w-8 h-8"/>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedTile.bg} text-slate-800 border ${selectedTile.border}`}>
                                    {selectedTile.type === 'PROP' ? (selectedTile.group === 'util' ? '公共事業' : selectedTile.group === 'station' ? '交通樞紐' : '一般地產') : '特殊格'}
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">{selectedTile.name}</h2>
                            <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl text-left italic border border-gray-100">"{selectedTile.story}"</p>
                            
                            {selectedTile.type === 'PROP' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                                        <span className="text-xs font-bold text-gray-500">地塊原價</span>
                                        <span className="font-mono font-bold text-gray-800">${selectedTile.price}</span>
                                    </div>
                                    {props[selectedTile.id] ? (
                                        <>
                                            <div className="flex justify-between items-center bg-indigo-50 p-2 rounded-lg">
                                                <span className="text-xs font-bold text-indigo-500">擁有者</span>
                                                <span className="font-bold text-indigo-700">{gameState.players.find(p=>p.uid===props[selectedTile.id].owner)?.name || '未知'}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg">
                                                <span className="text-xs font-bold text-red-500">目前過路費</span>
                                                <span className="font-mono font-black text-red-600">${calculateRent(selectedTile.id)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-green-50 text-green-600 p-2 rounded-lg text-sm font-bold">待售中</div>
                                    )}
                                </div>
                            )}
                            <button type="button" onClick={() => setSelectedTile(null)} className="w-full mt-6 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900">關閉</button>
                        </div>
                    </div>
                )}

                {/* 🌟 拍賣詳情升級版 */}
                {auction && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white p-6 rounded-3xl shadow-2xl text-center w-full max-w-sm border-4 border-yellow-400 animate-bounce-in">
                            <Gavel className="w-12 h-12 text-yellow-500 mx-auto mb-2"/>
                            <div className="text-sm font-bold text-gray-500 tracking-widest mb-1">法拍進行中</div>
                            <div className="text-2xl font-black text-gray-900 mb-2">{auction.tileName}</div>
                            {/* 顯示被拍賣地塊的原本價值 */}
                            <div className="text-xs text-gray-400 mb-4">(原價: ${MAP_DATA.find(t=>t.id == auction.tileId)?.price})</div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                <div className="text-sm text-gray-500 font-bold mb-1">目前最高出價</div>
                                <div className="text-4xl font-black text-green-600 mb-2">${auction.currentBid}</div>
                                {auction.highestBidder && <div className="text-xs text-gray-500 bg-gray-200 inline-block px-2 py-1 rounded-full">出價者: {gameState.players.find(p=>p.uid===auction.highestBidder)?.name}</div>}
                            </div>

                            {user.uid === auction.sellerUid ? (
                                <div className="text-sm text-gray-500 font-bold animate-pulse">等待其他玩家競標中...</div>
                            ) : auction.passedUids.includes(user.uid) ? (
                                <div className="text-sm text-gray-500 font-bold">您已放棄競標，等待結算...</div>
                            ) : (
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => handleAuction('BID')} className="flex-1 bg-yellow-400 text-yellow-900 py-3 rounded-xl font-black shadow-lg hover:bg-yellow-500 active:scale-95 transition-transform">加價 $10</button>
                                    <button type="button" onClick={() => handleAuction('PASS')} className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-300 active:scale-95 transition-transform">放棄競標</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {centralMsg && !auction && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 pointer-events-auto">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center w-full max-w-sm border-4 border-indigo-100 animate-bounce-in">
                            <div className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">{centralMsg.title}</div>
                            <div className={`text-2xl md:text-3xl font-black mb-6 leading-tight ${centralMsg.type === 'FAIL' ? 'text-red-600' : 'text-gray-800'}`}>{centralMsg.body}</div>
                            
                            {isMyTurn && currentAction && (currentAction.type === 'BUY' || currentAction.type === 'BUILD') && (
                                <div className="flex gap-3 justify-center">
                                    <button type="button" onClick={() => handleAction('YES')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-transform">確認</button>
                                    <button type="button" onClick={() => handleAction('NO')} className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-300 active:scale-95 transition-transform">放棄</button>
                                </div>
                            )}

                            {isMyTurn && currentAction && currentAction.type === 'BANKRUPT_CHOICE' && (
                                <div className="flex gap-3 justify-center">
                                    <button type="button" onClick={() => handleAction('START_AUCTION')} className="flex-1 bg-yellow-400 text-yellow-900 py-3 rounded-xl font-black shadow-lg hover:bg-yellow-500 active:scale-95 transition-transform">拍賣資產</button>
                                    <button type="button" onClick={() => handleAction('BANKRUPT')} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-transform">直接破產</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState.status === 'GAME_OVER' && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white p-10 rounded-3xl text-center shadow-2xl animate-bounce-in max-w-md w-full">
                            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6"/>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-wide">大獲全勝</h2>
                            <p className="text-2xl text-indigo-600 font-black mb-8">{gameState.winner}</p>
                            <button type="button" onClick={() => window.location.reload()} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg">回到主畫面</button>
                        </div>
                    </div>
                )}

                <div className="relative bg-slate-300 rounded-xl md:rounded-3xl shadow-2xl p-1.5 md:p-3 grid grid-cols-10 grid-rows-10 gap-[1px] md:gap-1 select-none w-full max-w-[800px] aspect-square">
                    <div className="col-start-2 col-end-10 row-start-2 row-end-10 bg-white/80 backdrop-blur-md rounded-lg md:rounded-2xl flex flex-col items-center justify-center p-4 z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] relative overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"><Crown size={250}/></div>
                        {!centralMsg && !auction && gameState.status === 'PLAYING' && (
                            <div className="flex flex-col items-center z-20 pointer-events-auto">
                                <div className="flex gap-4 md:gap-8 mb-6 md:mb-10">
                                    <ThreeDDice value={gameState.dice?.[0]} rolling={isRolling} />
                                    <ThreeDDice value={gameState.dice?.[1]} rolling={isRolling} />
                                </div>
                                <div className="text-center mb-6">
                                    <div className="text-xs md:text-sm font-bold text-indigo-400 tracking-widest uppercase mb-1">輪到你了</div>
                                    <div className="text-2xl md:text-4xl font-black text-gray-800 flex items-center gap-3">
                                        {currentPlayer.name}
                                        {isMyTurn && <span className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.8)]"/>}
                                    </div>
                                    {currentPlayer.doubleCount > 0 && <div className="mt-2 text-sm font-bold text-orange-500">🔥 雙骰連擊 ({currentPlayer.doubleCount}/2)</div>}
                                </div>
                                
                                <button 
                                    type="button"
                                    disabled={!isMyTurn || isRolling || hasRolled} 
                                    onClick={rollDice} 
                                    className={`px-12 md:px-16 py-4 md:py-5 rounded-full font-black text-2xl md:text-3xl shadow-xl transition-all ${!isMyTurn || isRolling || hasRolled ? 'bg-gray-300 text-gray-500 scale-95' : 'bg-gradient-to-b from-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-indigo-300/50'}`}
                                >
                                    {isRolling ? 'ROLLING...' : hasRolled ? '處理中...' : 'ROLL'}
                                </button>
                            </div>
                        )}
                    </div>

                    {MAP_DATA.map((tile) => {
                        let style = {}; const idx = tile.id;
                        if (idx >= 0 && idx <= 9) style = { gridRow: 10, gridColumn: 10 - idx };
                        else if (idx >= 10 && idx <= 17) style = { gridRow: 10 - (idx - 9), gridColumn: 1 };
                        else if (idx >= 18 && idx <= 27) style = { gridRow: 1, gridColumn: idx - 17 };
                        else if (idx >= 28 && idx <= 35) style = { gridRow: idx - 26, gridColumn: 10 };
                        
                        const prop = props[tile.id];
                        const owner = prop ? gameState.players.find(p => p.uid === prop.owner) : null;
                        const level = prop?.level || 0;
                        const isUtil = tile.group === 'util';
                        
                        const ownerAvatar = owner ? (AVATARS.find(a => a.id === owner.avatar) || AVATARS[0]) : null;
                        const ownerBorderColor = ownerAvatar ? ownerAvatar.color.replace('bg-', 'border-') : 'border-gray-300';
                        const ownerTextColor = ownerAvatar ? ownerAvatar.color.replace('bg-', 'text-') : 'text-gray-500';

                        return (
                            // 🌟 加入點擊開啟詳情的事件
                            <div key={`tile-${tile.id}`} onClick={() => setSelectedTile(tile)} style={style} className={`relative cursor-pointer rounded md:rounded-md border flex flex-col justify-between p-[2px] md:p-1 overflow-hidden bg-white active:scale-95 transition-transform ${tile.type === 'PROP' ? (owner ? `border-[2px] md:border-[3px] ${ownerBorderColor}` : 'border-gray-300 hover:border-gray-400') : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                                <div className="text-[6px] md:text-[9px] font-black text-center truncate text-slate-800 leading-tight">{tile.name}</div>
                                <div className="flex-1 flex flex-col items-center justify-center relative">
                                    {tile.type === 'PROP' ? (
                                        owner ? (
                                            <div className="flex flex-col items-center">
                                                <div className={`flex gap-[1px] md:gap-0.5 ${ownerTextColor}`}>
                                                    {level === 0 && <span className="text-[5px] md:text-[7px] font-bold opacity-80">{isUtil ? '廠房' : tile.group==='station'?'車站':'領地'}</span>}
                                                    {level === 1 && !isUtil && tile.group!=='station' && <Home size={10} className="md:w-4 md:h-4"/>}
                                                    {level === 2 && !isUtil && tile.group!=='station' && <span className="flex"><Home size={8} className="md:w-3 md:h-3"/><Home size={8} className="md:w-3 md:h-3"/></span>}
                                                    {level === 3 && !isUtil && tile.group!=='station' && <span className="flex"><Home size={6} className="md:w-2.5 md:h-2.5"/><Home size={6} className="md:w-2.5 md:h-2.5"/><Home size={6} className="md:w-2.5 md:h-2.5"/></span>}
                                                    {level >= 4 && !isUtil && tile.group!=='station' && <Building2 size={12} className="md:w-5 md:h-5"/>}
                                                </div>
                                            </div>
                                        ) : <span className="text-[6px] md:text-[10px] text-gray-400 font-mono font-bold">${tile.price}</span>
                                    ) : (
                                        tile.type === 'CHANCE' ? <AlertOctagon size={12} className="text-purple-500 md:w-5 md:h-5 opacity-70"/> :
                                        tile.type === 'GO' ? <Zap size={12} className="text-yellow-500 md:w-5 md:h-5"/> : 
                                        tile.type === 'JAIL' ? <span className="text-[10px] md:text-sm">⛓️</span> :
                                        tile.type === 'GOTOJAIL' ? <span className="text-[10px] md:text-sm">👮</span> : 
                                        (tile.group === 'station' ? <Train size={10} className="text-gray-500 md:w-4 md:h-4"/> : null)
                                    )}
                                </div>
                                {tile.type === 'PROP' && <div className={`h-[3px] md:h-1.5 w-full opacity-90 ${tile.group === 'brown' ? 'bg-[#8B4513]' : tile.group === 'pink' ? 'bg-[#FF69B4]' : tile.group === 'blue' ? 'bg-[#4169E1]' : tile.group === 'red' ? 'bg-[#DC143C]' : tile.group === 'yellow' ? 'bg-[#FFD700]' : tile.group === 'green' ? 'bg-[#228B22]' : tile.group === 'db' ? 'bg-[#00008B]' : tile.group === 'orange' ? 'bg-[#FF8C00]' : tile.group === 'station' ? 'bg-gray-800' : tile.group === 'util' ? 'bg-gray-400' : 'bg-[#87CEEB]'}`}></div>}
                            </div>
                        );
                    })}

                    {gameState.players.map((p, idx) => (
                        !p.isBankrupt && <PlayerToken key={`token-${p.uid}`} player={p} index={idx} totalPlayers={gameState.players.length} />
                    ))}
                </div>
            </div>
        </div>
    );
}