import React from 'react';
import { Crown, Trash2, PlayCircle, Loader, Wifi, Users, ArrowRight, Lock } from 'lucide-react';

export default function LobbyScreen({ 
    playerName, setPlayerName, 
    roomIdInput, setRoomIdInput, 
    roomPassword, setRoomPassword, 
    nameError, setNameError, 
    handleJoin, handleResetRoom, 
    loading, availableRooms 
}) {
    const onRoomClick = (r) => {
        if (r.password) {
            const pwd = window.prompt(`房間 #${r.roomId} 有密碼保護，請輸入密碼：`);
            if (pwd === null) return; // 取消
            handleJoin(r.roomId, pwd);
        } else {
            handleJoin(r.roomId, "");
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4 z-10 relative">
                <div className="text-center">
                    <Crown className="w-16 h-16 text-yellow-500 mx-auto" />
                    <h1 className="text-3xl font-black text-gray-800 tracking-wide mt-2">地產大亨</h1>
                    <p className="text-xs font-bold text-green-600 bg-green-50 rounded-full inline-block px-3 py-1 mt-2">輸入房號自動連線或創房</p>
                </div>

                <div className="space-y-3 pt-2">
                    <div className={`border-2 p-1 rounded-xl transition-all ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                        <input value={playerName} onChange={e => { setPlayerName(e.target.value); setNameError(false); }} placeholder="請輸入您的暱稱 (必填)" className="w-full p-2 outline-none text-center font-bold text-gray-700 bg-transparent"/>
                    </div>
                    
                    {/* 🌟 修正排版：改成上下排列，徹底解決跑版問題 */}
                    <div className="space-y-2">
                        <input value={roomIdInput} onChange={e => setRoomIdInput(e.target.value)} placeholder="輸入房號 (必填)" type="number" className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-bold text-gray-700"/>
                        <input value={roomPassword} onChange={e => setRoomPassword(e.target.value)} placeholder="設定/輸入房間密碼 (選填)" type="password" className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-bold text-gray-700"/>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                        <button onClick={handleResetRoom} className="bg-red-50 text-red-500 p-4 rounded-xl hover:bg-red-100 transition-colors" title="清除壞掉的房間"><Trash2/></button>
                        <button onClick={() => handleJoin()} disabled={loading} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
                            {loading ? <Loader className="animate-spin"/> : <span className="flex items-center gap-2"><PlayCircle size={20}/> 進入/創建</span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm mt-6">
                <div className="text-gray-500 font-bold mb-3 px-2 flex items-center gap-2"><Wifi size={16}/> 線上大廳列表</div>
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pb-4">
                    {availableRooms.length === 0 && <div className="text-center text-gray-400 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-white/50">無房間，請自行建立</div>}
                    
                    {availableRooms.map((r, index) => (
                        <button key={`${r.id}-${index}`} onClick={() => onRoomClick(r)} className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-indigo-300 transition-all group">
                            <div className="text-left flex items-center gap-3">
                                <div className="bg-indigo-100 text-indigo-700 font-black px-3 py-1 rounded-lg">#{r.roomId}</div>
                                <div className="text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <Users size={14}/> {r.players?.length || 0}/6
                                    {r.password && <Lock size={12} className="text-red-400 ml-1"/>}
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-indigo-500"/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}