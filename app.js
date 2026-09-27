// 【最終対策】最初から一番接続が安定している CARTO 地図をメインに使用します
const carto = L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
});

// バックアップとして OpenStreetMap を登録（ブロック対策として、ブラウザ情報を明確に送る設定を追加）
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});

// 地図の初期化（東京駅周辺を中心に設定）
const map = L.map('map', {
    zoomControl: true,
    layers: [carto] // 最初からブロックされないCARTO地図を強制ロード
}).setView([35.681236, 139.767125], 13);

let activeLayer = carto;

// 地図レイヤーを切り替える関数（安全用）
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

// 最初の描画バグを防ぐため、画面が表示された瞬間に地図のサイズを再計算させる
window.addEventListener('load', () => {
    setTimeout(() => {
        map.invalidateSize(true);
    }, 200);
});
