// 地図の初期化処理を関数にまとめる
function initMap() {
    // 1. 地図の初期化（HTMLの#map要素が確実に存在してから実行）
    const map = L.map('map', {
        zoomControl: false,
        fadeAnimation: false,
        trackResize: true
    }).setView([35.681236, 139.767125], 13);

    // 2. 地図タイルのロード（OpenStreetMapの標準タイルを使用し、より確実に読み込み）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // スマホの描画遅延対策：少し時間を置いてサイズを強制再計算
    setTimeout(() => {
        map.invalidateSize(true);
    }, 200);

    // 3. 状態管理（ピン追加モードがONかどうかのフラグ）
    let isAddPinMode = false;
    const addPinBtn = document.getElementById('add-pin-btn');

    // 「📍 ピンを追加」ボタンの処理
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
        if (!isAddPinMode) return;

        const comment = prompt("この場所に残すコメントを入力してください：");
        if (comment !== null && comment.trim() !== "") {
            const marker = L.marker(e.latlng).addTo(map);
            marker.bindPopup(`<b>コメント:</b><br>${comment}`).openPopup();
        }

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
            map.setView([lat, lng], 16);
        }, (error) => {
            alert("位置情報の取得に失敗しました。設定を確認してください。");
        });
    });
}

// 画面の準備が完全に整ってから地図を起動する（スマホのタイミングズレ対策）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}
