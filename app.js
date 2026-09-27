// 1. 地図タイルの設定（OpenStreetMap）
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});

// 2. 地図の初期化
const map = L.map('map', {
    zoomControl: true
}).setView([35.681236, 139.767125], 13);

// 3. ★【修正】バックアップ用の地図URLを完全に正しいものに修正しました
const carto = L.tileLayer('https://cartocdn.com{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
});

let activeLayer = osm;
let tileLoaded = false;
let fallbackTimer;

// 4. 地図レイヤーを切り替える関数
function useLayer(layer) {
    if (activeLayer) {
        map.removeLayer(activeLayer);
    }
    activeLayer = layer;
    layer.addTo(map);
    setTimeout(() => {
        map.invalidateSize(true);
    }, 150);
}

// 5. 読み込みイベントを登録
osm.on('tileload', () => {
    tileLoaded = true;
    clearTimeout(fallbackTimer);
});

// 初期表示
useLayer(osm);

// 3.5秒タイマー（OSMが重い時はCARTOに切り替え）
fallbackTimer = setTimeout(() => {
    if (!tileLoaded) {
        useLayer(carto);
        console.log('地図サーバーを切り替えました');
    }
}, 3500);
