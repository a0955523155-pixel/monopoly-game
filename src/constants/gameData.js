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
  { id: 0, type: 'GO', name: '起點', price: 0, color: 'bg-emerald-200', story: "領取 $800 薪水！" },
  { id: 1, type: 'PROP', name: '舊鎮', price: 120, rent: 15, group: 'brown', bg: 'bg-amber-100', border: 'border-amber-700', story: "充滿歷史痕跡的古老城鎮，吸引不少文青遊客。" },
  { id: 2, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200', story: "抽取一張命運卡，看看老天爺的安排。" },
  { id: 3, type: 'PROP', name: '老街', price: 150, rent: 18, group: 'brown', bg: 'bg-amber-100', border: 'border-amber-700', story: "每到假日就人山人海，滿是傳統美食的味道。" },
  { id: 4, type: 'PROP', name: '轉運站', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500', story: "交通樞紐，擁有越多車站，收取的過路費越高！" },
  { id: 5, type: 'PROP', name: '郊區', price: 200, rent: 25, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400', story: "空氣清新的市郊，許多退休人士的首選。" },
  { id: 6, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200', story: "機會卡！一瞬間可能致富，也可能破產。" },
  { id: 7, type: 'PROP', name: '學區', price: 220, rent: 28, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400', story: "明星學校聚集地，家長們擠破頭想把戶籍遷來這裡。" },
  { id: 8, type: 'PROP', name: '公園旁', price: 240, rent: 30, group: 'lb', bg: 'bg-sky-100', border: 'border-sky-400', story: "推開窗就能看見大片綠地，生活品質極高。" },
  { id: 9, type: 'JAIL', name: '探監', price: 0, color: 'bg-gray-300', story: "只是路過看看裡面的人，別擔心，你很自由。" },
  { id: 10, type: 'PROP', name: '夜市', price: 300, rent: 35, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500', story: "越夜越美麗，香雞排跟珍珠奶茶的香氣四溢。" },
  { id: 11, type: 'PROP', name: '電廠', price: 300, rent: 40, group: 'util', bg: 'bg-gray-100', border: 'border-gray-500', story: "供應全城電力的核心，與水廠一起擁有可獲得暴利。" },
  { id: 12, type: 'PROP', name: '酒吧街', price: 320, rent: 38, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500', story: "霓虹閃爍的狂歡地帶，年輕人週末的聚集地。" },
  { id: 13, type: 'PROP', name: 'KTV', price: 340, rent: 40, group: 'pink', bg: 'bg-pink-100', border: 'border-pink-500', story: "歡唱到天明！每晚都有走音的歌聲傳出。" },
  { id: 14, type: 'PROP', name: '北車', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500', story: "全國最大的鐵路迷宮，小心別在這裡迷路了。" },
  { id: 15, type: 'PROP', name: '購物街', price: 360, rent: 45, group: 'orange', bg: 'bg-orange-100', border: 'border-orange-500', story: "精品百貨林立，走一趟錢包就會莫名變薄。" },
  { id: 16, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200', story: "命運的齒輪開始轉動..." },
  { id: 17, type: 'PROP', name: '遊樂場', price: 400, rent: 50, group: 'orange', bg: 'bg-orange-100', border: 'border-orange-500', story: "巨大的雲霄飛車是這裡的地標，充滿歡笑聲。" },
  { id: 18, type: 'PARKING', name: '停車場', price: 0, color: 'bg-blue-200', story: "免費休息一回合！" },
  { id: 19, type: 'PROP', name: '商辦區', price: 450, rent: 55, group: 'red', bg: 'bg-red-100', border: 'border-red-600', story: "高樓大廈林立，充滿穿著西裝的上班族。" },
  { id: 20, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200', story: "把握機會，逆轉人生！" },
  { id: 21, type: 'PROP', name: '金融街', price: 480, rent: 60, group: 'red', bg: 'bg-red-100', border: 'border-red-600', story: "這裡是整個遊戲的經濟命脈，每秒都有百萬交易。" },
  { id: 22, type: 'PROP', name: '證交所', price: 500, rent: 65, group: 'red', bg: 'bg-red-100', border: 'border-red-600', story: "牛市還是熊市？來到這裡就是要賭一把！" },
  { id: 23, type: 'PROP', name: '高鐵站', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500', story: "一日生活圈的樞紐，快速移動帶來巨大人流。" },
  { id: 24, type: 'PROP', name: '別墅區', price: 520, rent: 70, group: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-500', story: "每戶都自帶游泳池，富豪們的隱密住所。" },
  { id: 25, type: 'PROP', name: '度假村', price: 550, rent: 75, group: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-500', story: "享受陽光沙灘與比基尼，住宿費可是天價。" },
  { id: 26, type: 'PROP', name: '水廠', price: 300, rent: 40, group: 'util', bg: 'bg-gray-100', border: 'border-gray-500', story: "沒有水怎麼活？與電廠合體將產生兩倍半的租金威力。" },
  { id: 27, type: 'GOTOJAIL', name: '坐牢', price: 0, color: 'bg-red-200', story: "你被捕了！立刻前往監獄，並停止行動兩回合。" },
  { id: 28, type: 'PROP', name: '富人區', price: 650, rent: 85, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600', story: "出入都是名車代步，路上的流浪狗都吃得比你好。" },
  { id: 29, type: 'PROP', name: '豪宅', price: 680, rent: 90, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600', story: "金碧輝煌的建築，連大門的把手都是純金打造。" },
  { id: 30, type: 'CHANCE', name: '命運', price: 0, color: 'bg-slate-200', story: "最後的命運安排..." },
  { id: 31, type: 'PROP', name: '科學園', price: 750, rent: 100, group: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600', story: "科技巨頭的總部所在地，創造了無數經濟奇蹟。" },
  { id: 32, type: 'PROP', name: '機場', price: 400, rent: 50, group: 'station', bg: 'bg-gray-200', border: 'border-gray-500', story: "通往世界的門戶，四座車站中最強大的一個。" },
  { id: 33, type: 'CHANCE', name: '機會', price: 0, color: 'bg-slate-200', story: "人生總是有無限可能。" },
  { id: 34, type: 'PROP', name: '天空城', price: 900, rent: 120, group: 'db', bg: 'bg-blue-100', border: 'border-blue-800', story: "漂浮在雲端的高級住宅，只有最頂尖的人才住得起。" },
  { id: 35, type: 'PROP', name: '帝寶', price: 1200, rent: 150, group: 'db', bg: 'bg-blue-100', border: 'border-blue-800', story: "地圖上最尊貴的地王，踩到這裡幾乎等於直接破產！" },
];

export const CHANCE_CARDS = [
  { text: "中樂透！+ $1000", amount: 1000 },
  { text: "股票分紅 + $500", amount: 500 },
  { text: "超速罰單 - $200", amount: -200 },
  { text: "請喝飲料 - $100", amount: -100 },
  { text: "撿到錢 + $100", amount: 100 },
  { text: "看醫生 - $300", amount: -300 },
];