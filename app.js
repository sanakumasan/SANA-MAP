// 1. 地図の初期化
const map = L.map('map', {
    zoomControl: false, // ボタンをスッキリさせるため非表示
    fadeAnimation: false
}).setView([35.681236, 139.767125], 13);

// 2. 地図タイルのロード
L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// フリーズ対策：地図の準備ができたらサイズを再計算
map.whenReady(() => {
    setTimeout(() => { map.invalidateSize(true); }, 300);
});

// 3. 状態管理（ピン追加モードがONかどうかのフラグ）
let isAddPinMode = false;
const addPinBtn = document.getElementById('add-pin-btn');

// 「📍 ピンを追加」ボタンを押したときの切り替え処理
addPinBtn.addEventListener('click', () => {
    isAddPinMode = !isAddPinMode;
    if (isAddPinMode) {
        addPinBtn.classList.add('active-btn');
        addPinBtn.innerText = '🗺️ 地図をタップ';
    } else {
        addPinBtn.classList.remove('active-btn');
        addPinBtn.innerText = '📍 ピンを追加';
    }
});

// 4. 地図をタップしたときにピンを立ててコメントを残す処理
map.on('click', (e) => {
    if (!isAddPinMode) return; // ピン追加モードじゃないときは何もしない

    // コメントを入力してもらうポップアップ（プロンプト）
    const comment = prompt("この場所に残すコメントを入力してください：");
    
    if (comment !== null && comment.trim() !== "") {
        // ピン（マーカー）を作成して地図に追加
        const marker = L.marker(e.latlng).addTo(map);
        
        // ピンをクリックしたときにコメントが表示されるように設定（最初から開く）
        marker.bindPopup(`<b>コメント:</b><br>${comment}`).openPopup();
    }

    // ピンを1本立てたら、安全のためモードを自動で解除する
    isAddPinMode = false;
    addPinBtn.classList.remove('active-btn');
    addPinBtn.innerText = '📍 ピンを追加';
});

// 5. 現在地取得機能
document.getElementById('current-location-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("お使いのブラウザは位置情報に対応していません。");
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 16); // 現在地にズームイン
    }, (error) => {
        alert("位置情報の取得に失敗しました。設定を確認してください。");
    });
});
