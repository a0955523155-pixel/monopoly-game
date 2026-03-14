import { Cat, Dog, Car, Ghost, Zap, Gift } from 'lucide-react';

export const BOARD_SIZE = 36;

export const AVATARS = [
  { id: 'dog', icon: Dog, color: 'bg-orange-500', name: '旺財' },
  { id: 'cat', icon: Cat, color: 'bg-pink-500', name: '喵皇' },
  { id: 'car', icon: Car, color: 'bg-blue-600', name: '超跑' },
  { id: 'ghost', icon: Ghost, color: 'bg-purple-600', name: '幽靈' },
  { id: 'zap', icon: Zap, color: 'bg-yellow-500', name: '閃電' },
  { id: 'gift', icon: Gift, color: 'bg-red-500', name: '禮物' },
];

export const MAP_DATA = [
  { id: 0, type: 'GO', name: '起點', price: 0, color: 'bg-emerald-200' },
  { id: 1, type: 'PROP', name: '舊鎮', price: 120, rent: 15, group: 'brown', bg: 'bg-amber-100', border: 'border-amber-700' },
  { id: 2, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200' },
  { id: 3, type: 'PROP', name: '老街', price: 150, rent: 18, group: 'brown', bg: 'bg-amber-100', border: 'border-amber-700' },
  { id: 4, type: 'PROP', name: '轉運站', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500' },
  { id: 5, type: 'PROP', name: '郊區', price: 200, rent: 25, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400' },
  { id: 6, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200' },
  { id: 7, type: 'PROP', name: '學區', price: 220, rent: 28, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400' },
  { id: 8, type: 'PROP', name: '公園旁', price: 240, rent: 30, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400' },
  { id: 9, type: 'JAIL', name: '探監', price: 0, color: 'bg-gray-300' },
  { id: 10, type: 'PROP', name: '夜市', price: 300, rent: 35, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500' },
  { id: 11, type: 'PROP', name: '電廠', price: 300, rent: 40, group: 'util', bg: 'bg-gray-100', border: 'border-gray-500' },
  { id: 12, type: 'PROP', name: '酒吧街', price: 320, rent: 38, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500' },
  { id: 13, type: 'PROP', name: 'KTV', price: 340, rent: 40, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500' },
  { id: 14, type: 'PROP', name: '北車', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500' },
  { id: 15, type: 'PROP', name: '購物街', price: 360, rent: 45, group: 'orange', bg: 'bg-orange-100', border: 'border-orange-500' },
  { id: 16, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200' },
  { id: 17, type: 'PROP', name: '遊樂場', price: 400, rent: 50, group: 'orange', bg: 'bg-orange-100', border: 'border-orange-500' },
  { id: 18, type: 'PARKING', name: '停車場', price: 0, color: 'bg-blue-200' },
  { id: 19, type: 'PROP', name: '商辦區', price: 450, rent: 55, group: 'red', bg: 'bg-red-100', border: 'border-red-600' },
  { id: 20, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200' },
  { id: 21, type: 'PROP', name: '金融街', price: 480, rent: 60, group: 'red', bg: 'bg-red-100', border: 'border-red-600' },
  { id: 22, type: 'PROP', name: '證交所', price: 500, rent: 65, group: 'red', bg: 'bg-red-100', border: 'border-red-600' },
  { id: 23, type: 'PROP', name: '高鐵站', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500' },
  { id: 24, type: 'PROP', name: '別墅區', price: 520, rent: 70, group: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-500' },
  { id: 25, type: 'PROP', name: '度假村', price: 550, rent: 75, group: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-500' },
  { id: 26, type: 'PROP', name: '水廠', price: 300, rent: 40, group: 'util', bg: 'bg-gray-100', border: 'border-gray-500' },
  { id: 27, type: 'GOTOJAIL', name: '坐牢', price: 0, color: 'bg-red-200' },
  { id: 28, type: 'PROP', name: '富人區', price: 650, rent: 85, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600' },
  { id: 29, type: 'PROP', name: '豪宅', price: 680, rent: 90, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600' },
  { id: 30, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200' },
  { id: 31, type: 'PROP', name: '科學園', price: 750, rent: 100, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600' },
  { id: 32, type: 'PROP', name: '機場', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500' },
  { id: 33, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200' },
  { id: 34, type: 'PROP', name: '天空城', price: 900, rent: 120, group: 'db', bg: 'bg-blue-100', border: 'border-blue-800' },
  { id: 35, type: 'PROP', name: '帝寶', price: 1200, rent: 150, group: 'db', bg: 'bg-blue-100', border: 'border-blue-800' },
];

export const CHANCE_CARDS = [
  { text: "中樂透！+ $1000", amount: 1000 },
  { text: "股票分紅 + $500", amount: 500 },
  { text: "超速罰單 - $200", amount: -200 },
  { text: "請喝飲料 - $100", amount: -100 },
  { text: "撿到錢 + $100", amount: 100 },
  { text: "看醫生 - $300", amount: -300 },
];