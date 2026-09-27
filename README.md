# SANA MAP OpenStreetMap版（地図表示修正版）

Google Maps APIキー不要。
Leaflet + OpenStreetMapを基本に、OSMタイルが読み込めない環境ではCARTOの地図タイルへ自動切替します。
既存の `index.html` と `manifest.json` をこの版で置き換えてください。

注意:
- OpenStreetMap/CARTOの帰属表示を残してください。
- 大量のタイル取得や自動巡回はしないでください。
