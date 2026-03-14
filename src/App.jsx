import React, { useState, useEffect, useRef } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc, arrayUnion, collection, query } from 'firebase/firestore';
import { auth, db, APP_ID, GAME_COLLECTION } from './config/firebase';
import { MAP_DATA, CHANCE_CARDS, AVATARS, BOARD_SIZE } from './constants/gameData';
import { Loader, AlertTriangle } from 'lucide-react';

import LobbyScreen from './screens/LobbyScreen';
import RoomScreen from './screens/RoomScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomPassword, setRoomPassword] = useState(""); 
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('initializing');
  const [errorMsg, setErrorMsg] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [nameError, setNameError] = useState(false);
  
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false); 
  const rollLock = useRef(false);

  const safeTurnIndex = gameState?.turnIndex || 0;
  const currentDoubleCount = gameState?.players?.[safeTurnIndex]?.doubleCount || 0;
  
  useEffect(() => { setHasRolled(false); setIsRolling(false); }, [safeTurnIndex, currentDoubleCount]);

  useEffect(() => {
    if (!auth) { setAuthStatus("error"); setErrorMsg("找不到 Firebase 驗證模組"); return; }
    const doAuth = async () => {
      try { setAuthStatus("initializing"); await signInAnonymously(auth); } 
      catch (err) { setAuthStatus("error"); setErrorMsg("登入驗證失敗：" + err.message); }
    };
    doAuth();
    const unsub = onAuthStateChanged(auth, (u) => { if (u) { setUser(u); setAuthStatus("success"); setErrorMsg(null); } });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (activeRoomId || !user || authStatus !== 'success') return;
    const q = collection(db, 'artifacts', APP_ID, 'public', 'data', GAME_COLLECTION);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach(doc => { 
          const d = doc.data(); 
          if(d.roomId && d.status === 'LOBBY') rooms.push({ id: doc.id, ...d }); 
      });
      rooms.sort((a,b)=>parseInt(a.roomId)-parseInt(b.roomId));
      setAvailableRooms(rooms);
    });
    return () => unsubscribe();
  }, [activeRoomId, user, authStatus]);

  useEffect(() => {
    if (!user || !activeRoomId || authStatus !== 'success') return;
    const unsubscribe = onSnapshot(doc(db, 'artifacts', APP_ID, 'public', 'data', GAME_COLLECTION, `room_${activeRoomId}`), (snap) => {
      if (snap.exists()) setGameState(snap.data());
      else { setGameState(null); if (activeRoomId) { setActiveRoomId(null); alert("房間已被關閉或重置。"); } }
    });
    return () => unsubscribe();
  }, [user, activeRoomId, authStatus]);

  const updateGame = async (updates) => {
    if (!activeRoomId) return;
    try { await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', GAME_COLLECTION, `room_${activeRoomId}`), updates); } 
    catch (e) { console.error("Update Game Error:", e); }
  };

  const handleResetRoom = async () => {
    if (!roomIdInput) return alert("請輸入房號");
    const id = roomIdInput.replace(/[^a-zA-Z0-9]/g, "");
    if(confirm(`確定刪除房間 ${id} 嗎？`)) {
        try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', GAME_COLLECTION, `room_${id}`)); alert("已刪除！"); } 
        catch (e) { alert("刪除失敗: " + e.message); }
    }
  };

  const handleJoin = async (targetId = null, listPassword = null) => {
    if (!playerName.trim()) { setNameError(true); return; }
    const rid = targetId || roomIdInput;
    if (!rid) return alert("請輸入房號");
    const safeId = String(rid).replace(/[^a-zA-Z0-9]/g, "");
    
    setLoading(true);
    try {
      const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', GAME_COLLECTION, `room_${safeId}`);
      const snap = await getDoc(ref);
      const myData = { uid: user.uid, name: playerName, money: 5000, pos: 0, avatar: 'dog', isReady: false, isBankrupt: false, inJail: 0, doubleCount: 0 };

      if (!snap.exists()) {
        await setDoc(ref, { roomId: safeId, password: roomPassword, status: 'LOBBY', players: [myData], host: user.uid, turnIndex: 0, dice: [1, 1], properties: {}, currentAction: null, actionEventId: Date.now() });
      } else {
        const d = snap.data();
        const enteredPwd = targetId ? (listPassword !== null ? listPassword : "") : roomPassword;
        if (d.password && d.password !== enteredPwd) throw new Error("房間密碼錯誤！");

        let players = [...(d.players||[])];
        const idx = players.findIndex(p => p.uid === user.uid);
        if (idx !== -1) { players[idx].name = playerName; await updateDoc(ref, { players }); } 
        else {
           if (d.status !== 'LOBBY') throw new Error("遊戲已經開始，無法加入");
           if (players.length >= 6) throw new Error("房間人數已滿");
           const used = players.map(p=>p.avatar);
           myData.avatar = (AVATARS.find(a=>!used.includes(a.id)) || AVATARS[0]).id;
           await updateDoc(ref, { players: arrayUnion(myData) });
        }
      }
      setActiveRoomId(safeId); setRoomIdInput(safeId);
    } catch (e) { alert("連線失敗: " + e.message); }
    setLoading(false);
  };

  const handleRollOrder = async () => {
      if (rollLock.current) return;
      rollLock.current = true; setIsRolling(true);
      const d1 = Math.ceil(Math.random() * 6);
      const d2 = Math.ceil(Math.random() * 6);
      setTimeout(async () => {
          const rolls = gameState.orderRolls || [];
          const updated = [...rolls, { uid: user.uid, name: playerName, val: d1+d2 }];
          let updates = { orderRolls: updated };
          if (updated.length === gameState.players.length) {
              updates.status = 'PLAYING';
              updates.players = [...gameState.players].sort((a,b) => (updated.find(r=>r.uid===b.uid)?.val || 0) - (updated.find(r=>r.uid===a.uid)?.val || 0));
              updates.turnIndex = 0;
          }
          await updateGame(updates);
          setIsRolling(false); rollLock.current = false;
      }, 1000);
  };

  const rollDice = async () => {
    if (hasRolled || rollLock.current || gameState?.status !== 'PLAYING') return;
    setHasRolled(true); rollLock.current = true; setIsRolling(true);

    setTimeout(async () => {
      const players = [...gameState.players];
      const turnIndex = gameState.turnIndex;
      const p = { ...players[turnIndex] };
      
      const d1 = Math.ceil(Math.random()*6);
      const d2 = Math.ceil(Math.random()*6);
      const isDouble = d1 === d2;

      if (p.inJail > 0) {
         if (isDouble) p.inJail = 0; 
         else {
             p.inJail -= 1; players[turnIndex] = p;
             await updateGame({ dice: [d1, d2], players, centralMessage: { title: "探監", body: `沒骰出雙胞胎，還要關 ${p.inJail} 回合`, type: 'JAIL' }, actionEventId: Date.now(), sfx: 'error' });
             setTimeout(() => nextTurn(players, turnIndex), 1500);
             setIsRolling(false); rollLock.current = false; return;
         }
      }

      p.doubleCount = isDouble ? (p.doubleCount || 0) + 1 : 0;
      const steps = d1 + d2;
      let newPos = (p.pos + steps) % BOARD_SIZE;
      let passedGo = (p.pos + steps) >= BOARD_SIZE;
      
      p.pos = newPos;
      p.money += (passedGo ? 800 : 0);
      players[turnIndex] = p;
      
      await updateGame({ dice: [d1, d2], players, centralMessage: null, sfx: 'roll' });
      setIsRolling(false); rollLock.current = false;
      setTimeout(() => handleTile(newPos, p, players, turnIndex), 800);
    }, 1200);
  };

  const handleTile = async (pos, player, ps, turnIndex) => {
    const tile = MAP_DATA[pos];
    const props = gameState.properties || {};
    let shouldNext = true;
    
    if (tile.type === 'PROP') {
      const propData = props[tile.id];
      if (!propData) {
        if (player.money >= tile.price) {
           await updateGame({ currentAction: { type: 'BUY', tileId: tile.id, price: tile.price, name: tile.name }, centralMessage: { title: "出售", body: `${tile.name} $${tile.price}`, type: 'BUY' }, actionEventId: Date.now() });
           shouldNext = false;
        } else await updateGame({ centralMessage: { title: "過路", body: "現金不足", type: 'INFO' }, actionEventId: Date.now() });
      } else if (propData.owner === user.uid) {
        // 🌟 車站與水電廠不可升級
        if (tile.group === 'util' || tile.group === 'station') {
            await updateGame({ centralMessage: { title: "特殊地產", body: `${tile.group === 'util' ? '水電廠' : '車站'}無法升級`, type: 'INFO' }, actionEventId: Date.now() });
        } else {
            const lvl = propData.level || 0;
            if (lvl < 4) {
                // 🌟 蓋房子成本遞增 (基底價格的 1倍, 1.5倍, 2倍, 2.5倍)
                const cost = Math.floor(tile.price * (1 + lvl * 0.5));
                if (player.money >= cost) {
                    await updateGame({ currentAction: { type: 'BUILD', tileId: tile.id, price: cost, name: tile.name, level: lvl+1 }, centralMessage: { title: "升級", body: `加蓋需 $${cost}`, type: 'MANAGE' }, actionEventId: Date.now() });
                    shouldNext = false;
                } else await updateGame({ centralMessage: { title: "資金不足", body: `升級需 $${cost}`, type: 'INFO' }, actionEventId: Date.now(), sfx: 'error' });
            } else await updateGame({ centralMessage: { title: "滿級", body: "摩天大樓!", type: 'INFO' }, actionEventId: Date.now() });
        }
      } else {
        const ownerIdx = ps.findIndex(p => p.uid === propData.owner);
        if (ownerIdx !== -1 && !ps[ownerIdx].inJail) {
           const lvl = propData.level || 0;
           let rent = 0; let bonusText = "";
           
           if (tile.group === 'station') {
               const count = MAP_DATA.filter(t => t.group === 'station' && props[t.id]?.owner === propData.owner).length;
               rent = tile.rent * Math.pow(2, count - 1);
               if (count > 1) bonusText = ` (${count} 車站)`;
           } else if (tile.group === 'util') {
               const count = MAP_DATA.filter(t => t.group === 'util' && props[t.id]?.owner === propData.owner).length;
               rent = tile.rent * (count > 1 ? 2.5 : 1);
               if (count > 1) bonusText = " (雙霸天!)";
           } else {
               const multipliers = [1, 5, 15, 45, 80];
               rent = tile.rent * multipliers[lvl];
               const groupTiles = MAP_DATA.filter(t => t.group === tile.group);
               const ownsAll = groupTiles.every(t => props[t.id]?.owner === propData.owner);
               if (ownsAll && lvl === 0) { rent *= 2; bonusText = " (同色加倍!)"; }
           }
           
           player.money -= rent;
           ps[ownerIdx].money += rent;
           ps[turnIndex] = player;
           await updateGame({ players: ps, centralMessage: { title: "付租金", body: `給 ${ps[ownerIdx].name} $${rent}${bonusText}`, type: 'RENT' }, actionEventId: Date.now(), sfx: 'money' });
           setTimeout(() => checkBankrupt(player, ps, turnIndex), 2500);
           return;
        }
      }
    } else if (tile.type === 'CHANCE') {
       const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
       await updateGame({ centralMessage: { title: "機會命運", body: card.text, type: 'CHANCE' }, actionEventId: Date.now(), sfx: card.amount > 0 ? 'money' : 'error' });
       setTimeout(async () => {
          player.money += card.amount;
          ps[turnIndex] = player;
          await updateGame({ players: ps, centralMessage: null });
          checkBankrupt(player, ps, turnIndex);
       }, 3000);
       return;
    } else if (tile.type === 'GOTOJAIL') {
       player.pos = 9; player.inJail = 2; player.doubleCount = 0;
       ps[turnIndex] = player;
       await updateGame({ players: ps, centralMessage: { title: "入獄", body: "暫停 2 回合", type: 'JAIL' }, actionEventId: Date.now(), sfx: 'error' });
       shouldNext = true;
    }

    if (shouldNext) setTimeout(() => nextTurn(ps, turnIndex), 1500);
  };

  const handleAction = async (type) => {
    const act = gameState.currentAction;
    if(!act) return;
    let ps = [...(gameState.players||[])];
    const turnIndex = gameState.turnIndex;
    let props = { ...(gameState.properties||{}) };
    
    if (type === 'YES') {
       ps[turnIndex].money -= act.price;
       props[act.tileId] = { owner: user.uid, level: act.type === 'BUY' ? 0 : (props[act.tileId]?.level || 0) + 1 };
       await updateGame({ players: ps, properties: props, currentAction: null, centralMessage: null, sfx: act.type === 'BUY' ? 'buy' : 'build' });
    } else if (type === 'SELL') {
        const lvl = props[act.tileId]?.level || 0;
        ps[turnIndex].money += Math.floor(act.price * 0.5 * (lvl+1));
        delete props[act.tileId];
        await updateGame({ players: ps, properties: props, currentAction: null, centralMessage: null, sfx: 'money' });
    } else if (type === 'BANKRUPT') {
        processBankruptcy(ps[turnIndex], ps, turnIndex);
        return;
    } else if (type === 'START_AUCTION') {
        const myProps = Object.keys(props).filter(k => props[k].owner === user.uid).sort((a,b) => (props[b].level||0) - (props[a].level||0));
        const targetId = myProps[0];
        const tileInfo = MAP_DATA.find(t=>t.id == parseInt(targetId));
        const base = Math.floor(tileInfo.price / 3);
        await updateGame({ 
            auction: { sellerUid: user.uid, tileId: targetId, tileName: tileInfo.name, currentBid: base, highestBidder: null, passedUids: [] },
            currentAction: null, centralMessage: null 
        });
        return;
    } else {
       await updateGame({ currentAction: null, centralMessage: null });
    }
    nextTurn(ps, turnIndex);
  };

  const checkBankrupt = async (p, ps, turnIndex) => {
    if (p.money < 0) {
      const hasAssets = Object.keys(gameState.properties || {}).some(k => (gameState.properties||{})[k].owner === p.uid);
      if (!hasAssets) processBankruptcy(p, ps, turnIndex);
      else await updateGame({ currentAction: { type: 'BANKRUPT_CHOICE' }, centralMessage: { title: "瀕臨破產", body: "你要直接破產，還是拍賣資產求生？", type: 'FAIL' }, actionEventId: Date.now(), sfx: 'error' });
    } else nextTurn(ps, turnIndex);
  };

  const processBankruptcy = async (p, ps, turnIndex) => {
      p.isBankrupt = true; p.money = 0; p.doubleCount = 0; ps[turnIndex] = p;
      let props = { ...(gameState.properties||{}) };
      Object.keys(props).forEach(k => { if(props[k].owner === p.uid) delete props[k]; });
      await updateGame({ players: ps, properties: props, currentAction: null, centralMessage: { title: "破產", body: `${p.name} 出局`, type: 'FAIL' }, actionEventId: Date.now(), sfx: 'error' });
      setTimeout(() => nextTurn(ps, turnIndex), 3500);
  }

  const nextTurn = async (ps, currentTurnIdx) => {
    if (ps.length === 0) return;
    let next = currentTurnIdx;
    let p = ps[currentTurnIdx];

    if (p.doubleCount > 0 && p.doubleCount <= 2 && !p.isBankrupt && !p.inJail) {
        await updateGame({ centralMessage: { title: "雙骰加碼", body: "獲得額外一回合！", type: 'INFO' }, actionEventId: Date.now() });
    } else {
        p.doubleCount = 0; ps[currentTurnIdx] = p;
        next = (currentTurnIdx + 1) % ps.length;
        let tries = 0;
        while (ps[next].isBankrupt && tries < ps.length) { next = (next + 1) % ps.length; tries++; }
    }
    
    const active = ps.filter(p => !p.isBankrupt);
    if (active.length === 1 && ps.length > 1) await updateGame({ status: 'GAME_OVER', winner: active[0].name });
    else await updateGame({ players: ps, turnIndex: next, centralMessage: null });
  };

  const handleAuction = async (action) => {
      if(!gameState.auction) return;
      const auc = gameState.auction;
      if (action === 'BID') {
          await updateGame({ auction: { ...auc, currentBid: auc.currentBid + 10, highestBidder: user.uid, passedUids: [] }, sfx: 'buy' });
      } else if (action === 'PASS') {
          const newPassed = [...auc.passedUids, user.uid];
          const activePlayers = gameState.players.filter(p => !p.isBankrupt && p.uid !== auc.sellerUid);
          
          // 🌟 修復拍賣卡死：扣除最高出價者後，計算需要放棄的人數
          const requiredPasses = activePlayers.length - (auc.highestBidder ? 1 : 0);
          
          if (newPassed.length >= requiredPasses) {
              let ps = [...gameState.players]; let props = {...gameState.properties};
              const sIdx = ps.findIndex(p => p.uid === auc.sellerUid);
              if (auc.highestBidder) {
                  const bIdx = ps.findIndex(p => p.uid === auc.highestBidder);
                  ps[bIdx].money -= auc.currentBid;
                  ps[sIdx].money += Math.floor(auc.currentBid * 2 / 3);
                  props[auc.tileId] = { owner: auc.highestBidder, level: 0 };
              } else delete props[auc.tileId]; 
              
              await updateGame({ players: ps, properties: props, auction: null, sfx: 'money' });
              if (ps[sIdx].money < 0) checkBankrupt(ps[sIdx], ps, sIdx); 
              else nextTurn(ps, sIdx);
          } else await updateGame({ auction: { ...auc, passedUids: newPassed } });
      }
  }

  const sendTaunt = async (text) => {
      await updateGame({ taunt: { uid: user.uid, text, ts: Date.now() } });
  }

  try {
      if (authStatus === 'initializing') return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin text-indigo-500 w-12 h-12" /></div>;
      if (authStatus === 'error') return <div className="h-screen flex items-center justify-center p-6 text-center"><AlertTriangle className="text-red-500 w-20 h-20 mb-4" /><h1>無法連線到伺服器</h1></div>;
      if (!activeRoomId) return <LobbyScreen {...{playerName, setPlayerName, roomIdInput, setRoomIdInput, roomPassword, setRoomPassword, nameError, setNameError, handleJoin, handleResetRoom, loading, availableRooms}} />;
      if (!gameState || !gameState.players || !user) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin w-12 h-12"/></div>;
      if (gameState.status === 'LOBBY' || gameState.status === 'DETERMINE_ORDER') return <RoomScreen {...{gameState, user, updateGame, setActiveRoomId, setGameState, handleRollOrder, isRolling}} />;
      
      return <GameScreen {...{gameState, user, setActiveRoomId, setGameState, rollDice, isRolling, hasRolled, handleAction, handleAuction, sendTaunt}} />;
  } catch (err) { return <div>遊戲渲染錯誤: {err.message}</div>; }
}