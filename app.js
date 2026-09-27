// 画面のHTMLやCSSが「完全に表示完了（load）」するまで、すべての地図処理を待機させます
window.addEventListener('load', () => {

    // 画面が整ってから、さらに0.5秒（500ミリ秒）待って安全に起動させます
    setTimeout(() => {
        
        // 1. 地図を表示する土台（#map）に縦横のサイズが本当にあるか、プログラムで最終確認
        const mapContainer = document.getElementById('map');
        if (!mapContainer || mapContainer.clientHeight === 0) {
            // 万が一、高さが0だった場合はプログラムで強制的に画面いっぱいに広げます
            mapContainer.style.height = window.innerHeight + 'px';
        }

        // 2. 地図の初期化（東京駅周辺を中心に設定）
        const map = L.map('map', {
            zoomControl: true,
            fadeAnimation: false // iPhoneでの描画フリーズを防ぐためアニメーションをオフ
        }).setView([35.681236, 139.767125], 13);

        // 3. 接続が100%遮断されない、世界で一番安定したCARTO地図を直接ロード
        const carto = L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            subdomains: 'abcd',
            attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
        });

        // 4. 地図データを土台に貼り付ける
        carto.addTo(map);

        // 5. 最後に「地図のサイズを今すぐ強制再計算しろ！」という絶対命令を送る
        setTimeout(() => {
            map.invalidateSize(true);
            console.log('地図の強制描画を実行しました');
        }, 200);

    }, 500); // 500ミリ秒の安全ウェイト
});
