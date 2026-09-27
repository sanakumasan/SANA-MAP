// 画面の完了を一切待たずに、開いた瞬間に最優先で地図を起動します
try {
    // 1. 地図の初期化（東京駅周辺を中心に設定）
    const map = L.map('map', {
        zoomControl: true
    }).setView([35.681236, 139.767125], 13);

    // 2. 最も通信が安定している CARTO 地図をロード
    const carto = L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap'
    });

    // 3. 地図を土台に貼り付ける
    carto.addTo(map);

    // 4. 即座にサイズ強制再計算
    map.invalidateSize(true);
    
    // 【テスト成功の合図】地図のプログラムが最後まで無事に動いたら、画面上にアラートを出します
    alert('地図のプログラムは正常に最後まで動きました！');

} catch (error) {
    // 【テスト失敗の合図】もし途中でプログラムがクラッシュしたら、原因を画面にポップアップ表示します
    alert('エラーが発生しました: ' + error.message);
}
