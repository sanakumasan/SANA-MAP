const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
});

const map = L.map('map', {zoomControl:true}).setView([35.681236, 139.767125], 13);

const carto = L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
});

let activeLayer = osm, tileLoaded = false, fallbackTimer;

function useLayer(layer) {
    if (activeLayer) map.removeLayer(activeLayer);
    activeLayer = layer;
    layer.addTo(map);
    setTimeout(() => map.invalidateSize(true), 150);
}

useLayer(osm);

osm.on('tileload', () => {
    tileLoaded = true; clearTimeout(fallbackTimer);
});
fallbackTimer = setTimeout(() => {
    if (!tileLoaded) {
        useLayer(carto);
        toast('地図サーバーを切り替えました');
    }
}, 3500);

window.addEventListener('load', () => setTimeout(() => map.invalidateSize(true), 300));
window.addEventListener('orientationchange', () => setTimeout(() => map.invalidateSize(true), 400));

let pins = JSON.parse(localStorage.getItem('sana_map_pins') || '[]'), pending = null, selectedId = null, markers = new Map();
function persist() {
    localStorage.setItem('sana_map_pins', JSON.stringify(pins));
}
function toast(t) {
    const n = document.getElementById('notice'); if(n) { n.textContent = t; n.style.display = 'block'; setTimeout(() => n.style.display = 'none', 1800); }
}
function esc(s) {
    return String(s).replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[m]));
}
function markerFor(p) {
    const m = L.marker([p.lat, p.lng]).addTo(map).bindTooltip(p.title || p.category);
    m.on('click', () => { showDetail(p.id); });
    markers.set(p.id, m);
}
pins.forEach(markerFor);

map.on('click', e => {
    pending = { lat: e.latlng.lat, lng: e.latlng.lng }; openModal();
});
function openModal() {
    document.getElementById('modal')?.classList.add('show'); setTimeout(() => document.getElementById('pinTitle')?.focus(), 100);
}
function closeModal() {
    document.getElementById('modal')?.classList.remove('show'); pending = null;
}
function showDetail(id) {
    const p = pins.find(x => x.id === id); if (!p) return;
    selectedId = id;
    document.getElementById('dTitle').textContent = p.title || '名称未設定';
    document.getElementById('dMeta').textContent = `${p.category} ・ ${new Date(p.createdAt).toLocaleString('ja-JP')}`;
    document.getElementById('dComment').textContent = p.comment || 'コメントなし';
    document.getElementById('dTags').innerHTML = (p.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('');
    document.getElementById('detail')?.classList.add('show');
}

const saveBtn = document.getElementById('save');
if(saveBtn) {
    saveBtn.onclick = () => {
        if (!pending) return;
        const p = {
            id: crypto.randomUUID(), ...pending,
            title: document.getElementById('pinTitle').value.trim(), category: document.getElementById('pinCategory').value,
            comment: document.getElementById('pinComment').value.trim(),
            tags: document.getElementById('pinTags').value.split(',').map(x => x.trim()).filter(Boolean),
            createdAt: Date.now()
        };
        pins.push(p); persist(); markerFor(p); closeModal(); showDetail(p.id);
        document.getElementById('pinTitle').value = ''; document.getElementById('pinComment').value = ''; document.getElementById('pinTags').value = ''; toast('保存しました');
    };
}
const cancelBtn = document.getElementById('cancel'); if(cancelBtn) cancelBtn.onclick = closeModal;
const closeDetailBtn = document.getElementById('closeDetail'); if(closeDetailBtn) closeDetailBtn.onclick = () => document.getElementById('detail')?.classList.remove('show');
const deletePinBtn = document.getElementById('deletePin');
if(deletePinBtn) {
    deletePinBtn.onclick = () => {
        if (!selectedId) return;
        markers.get(selectedId)?.remove(); markers.delete(selectedId);
        pins = pins.filter(p => p.id !== selectedId); persist();
        selectedId = null; document.getElementById('detail')?.classList.remove('show'); toast('削除しました');
    };
}
const newPinBtn = document.getElementById('newPin');
if(newPinBtn) {
    newPinBtn.onclick = () => {
        const c = map.getCenter(); pending = { lat: c.lat, lng: c.lng }; openModal();
    };
}
const listBtn = document.getElementById('list');
if(listBtn) {
    listBtn.onclick = () => {
        const listItems = document.getElementById('listItems');
        listItems.innerHTML = pins.length ? pins.slice().reverse().map(p => `
            <div style="padding:13px 0;border-bottom:1px solid #eee" data-id="${p.id}">
                <b>${esc(p.title || '名称未設定')}</b>
                <div class="meta">${esc(p.category)} ・ ${new Date(p.createdAt).toLocaleString('ja-JP')}</div>
                <div>${esc((p.comment || '').slice(0, 80))}</div>
            </div>`).join('') : 'まだ保存したピンはありません';
        listItems.querySelectorAll('[data-id]').forEach(x => {
            x.onclick = () => {
                const p = pins.find(a => a.id === x.dataset.id);
                document.getElementById('listPanel')?.classList.remove('show'); map.setView([p.lat, p.lng], 16); showDetail(p.id);
            };
        });
        document.getElementById('listPanel')?.classList.add('show');
    };
}
const closeListBtn = document.getElementById('closeList'); if(closeListBtn) closeListBtn.onclick = () => document.getElementById('listPanel')?.classList.remove('show');
const locateBtn = document.getElementById('locate');
if(locateBtn) {
    locateBtn.onclick = () => navigator.geolocation?.getCurrentPosition(
        p => { map.setView([p.coords.latitude, p.coords.longitude], 17); toast('現在地へ移動しました'); },
        () => alert('位置情報を許可してください')
    );
}
const exportBtn = document.getElementById('export');
if(exportBtn) {
    exportBtn.onclick = () => {
        const b = new Blob([JSON.stringify(pins, null, 2)], { type: 'application/json' }),
              a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'sana-map-backup.json'; a.click(); toast('バックアップを保存しました');
    };
}
const searchInput = document.getElementById('search');
if(searchInput) {
    searchInput.onkeydown = async e => {
        if (e.key !== 'Enter') return;
        const q = searchInput.value.trim(); if (!q) return;
        try {
            const r = await fetch(`https://openstreetmap.org{encodeURIComponent(q)}`, { headers: { 'Accept': 'application/json' } }),
                  a = await r.json();
            if (!a.length) return toast('場所が見つかりません');
            map.setView([+a[0].lat, +a[0].lon], 16);
        } catch (_) { toast('検索に失敗しました'); }
    };
}
