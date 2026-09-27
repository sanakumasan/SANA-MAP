// 1. 地図の初期化 (中心を東京駅付近に設定、ズームレベル15)
const map = L.map('map', {
    zoomControl: true
}).setView([35.681236, 139.767125], 15);

// 2. OpenStreetMapのタイルレイヤーを追加 (クレジット表示は必須)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// 保存されたピンを入れる配列
let savedPins = JSON.parse(localStorage.getItem('sana_map_pins')) || [];

// アプリ起動時に保存済みのピンを地図に描画する関数
function loadSavedPins() {
    savedPins.forEach((pinData, index) => {
        createMarker(pinData.lat, pinData.lng, pinData.comment, index);
    });
}

// マーカー（ピン）を作成して地図に配置する関数
function createMarker(lat, lng, comment, index) {
    const marker = L.marker([lat, lng]).addTo(map);
    
    // ピンをクリックしたときにポップアップ（コメント）を表示
    if (comment) {
        marker.bindPopup(`<strong>コメント:</strong><br>${comment}`);
    }
}

// 3. 「ピンを追加」ボタンの動作
document.getElementById('add-pin-btn').addEventListener('click', () => {
    // 地図の中心座標を取得
    const center = map.getCenter();
    const comment = prompt("この場所に残すコメントを入力してください：");
    
    if (comment !== null) { // キャンセルされなかった場合
        const newPin = {
            lat: center.lat,
            lng: center.lng,
            comment: comment
        };
        
        // 配列に追加して保存
        savedPins.push(newPin);
        localStorage.setItem('sana_map_pins', JSON.stringify(savedPins));
        
        // 地図上にピンを生成
        createMarker(newPin.lat, newPin.lng, newPin.comment, savedPins.length - 1);
        alert("ピンを保存しました！");
    }
});

// 4. 「現在地」ボタンの動作
document.getElementById('current-location-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("お使いのブラウザは現在地取得に対応していません。");
        return;
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 16); // 現在地にスムーズに移動
    }, (error) => {
        alert("現在地の取得に失敗しました。位置情報の許可を確認してください。");
    });
});

// 5. 「保存一覧」ボタンの動作（簡易版）
document.getElementById('list-btn').addEventListener('click', () => {
    if (savedPins.length === 0) {
        alert("保存されたピンはありません。");
        return;
    }
    const list = savedPins.map((p, i) => `${i + 1}: ${p.comment || 'コメントなし'} (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`).join('\n');
    alert("【保存一覧】\n" + list);
});

// 6. 「バックアップ」ボタンの動作（JSONテキストとして出力）
document.getElementById('backup-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(savedPins, null, 2);
    alert("以下のデータをコピーしてバックアップしてください：\n\n" + dataStr);
});

// 初回読み込み時に実行
loadSavedPins();
