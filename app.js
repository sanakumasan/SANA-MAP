// 1. 地図の初期化（東京駅周辺を中心に設定）
const map = L.map('map', {
    zoomControl: true,
    fadeAnimation: false
}).setView([35.681236, 139.767125], 13);

// 2. 最も通信が安定している CARTO 地図をロード
const carto = L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
});

// 3. 地図を土台に貼り付ける
carto.addTo(map);

// 4. 最初の描画バグを防ぐため、画面表示から少し遅らせてサイズを強制再計算させる
window.addEventListener('load', () => {
    setTimeout(() => {
        map.invalidateSize(true);
    }, 300);
});
