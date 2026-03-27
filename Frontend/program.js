const API = "http://127.0.0.1:8000";
let mapa = null, linea = null, paradaCoords = {};
const contenido = document.getElementById("contenido");
const selEst = document.getElementById("select-estacion");

const dist = (a, b) => {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0]-a[0])*r, dLon = (b[1]-a[1])*r;
    return (2*R*Math.asin(Math.sqrt(Math.sin(dLat/2)**2 + Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)**2))).toFixed(2);
};

const limpiar = html => {
    if (mapa) { mapa.remove(); mapa = null; } linea = null;
    contenido.innerHTML = html;
};

const crearMapa = id => {
    const m = L.map(id).setView([4.65, -74.05], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
    return m;
};

const llenar = (sel, ph) => {
    sel.innerHTML = `<option value="">${ph}</option>`;
    Object.keys(paradaCoords).sort().forEach(n => sel.add(new Option(n, n)));
};

const chapinero = m => fetch(API + "/map").then(r => r.json()).then(d => L.geoJSON(d).addTo(m));

const sitp = m => fetch(API + "/sitp/chapinero").then(r => r.json()).then(d => {
    paradaCoords = {};
    d.features.forEach((f, i) => {
        let n = f.properties.name?.trim() || `Paradero ${i + 1}`;
        if (paradaCoords[n]) { let k = 2; while (paradaCoords[`${n} (${k})`]) k++; n = `${n} (${k})`; }
        const [lon, lat] = f.geometry.coordinates;
        paradaCoords[n] = [lat, lon];
    });
    llenar(selEst, "Estaciones");
    L.geoJSON(d, { onEachFeature: (f, l) => {
        const n = f.properties.name?.trim() || "Sin nombre";
        const wiki = `https://es.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent("SITP " + n + " Bogotá")}`;
        l.bindPopup(`<b>${n}</b><br><a href="${wiki}" target="_blank">🔗 Wikipedia</a>`);
    }}).addTo(m);
});

function mostrar(op) {
    if (op === "mapa") {
        limpiar('<div id="map" style="height:500px"></div>');
        mapa = crearMapa("map"); chapinero(mapa);
    }
    if (op === "mapsitp") {
        limpiar('<div id="map-sitp" style="height:500px"></div>');
        mapa = crearMapa("map-sitp"); chapinero(mapa); sitp(mapa);
    }
    if (op === "analisis") {
        limpiar(`<div class="analisis-bar">
            <select id="pto-a"><option value="">Parada A</option></select>
            <select id="pto-b"><option value="">Parada B</option></select>
            <span id="info-dist"></span>
        </div><div id="map-analisis" style="height:440px"></div>`);
        mapa = crearMapa("map-analisis"); chapinero(mapa);
        sitp(mapa).then(() => {
            const a = document.getElementById("pto-a"), b = document.getElementById("pto-b");
            llenar(a, "Parada A"); llenar(b, "Parada B");
            [a, b].forEach(s => s.addEventListener("change", () => {
                const pa = paradaCoords[a.value], pb = paradaCoords[b.value];
                if (!pa || !pb) return;
                if (linea) mapa.removeLayer(linea);
                linea = L.polyline([pa, pb], { color: "#e74c3c", weight: 3 }).addTo(mapa);
                mapa.fitBounds(linea.getBounds(), { padding: [40, 40] });
                document.getElementById("info-dist").textContent = `📏 ${dist(pa, pb)} km`;
            }));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-mapa").addEventListener("click", () => mostrar("mapa"));
    document.getElementById("btn-mapsitp").addEventListener("click", () => mostrar("mapsitp"));
    document.getElementById("btn-analisis").addEventListener("click", () => mostrar("analisis"));
    selEst.addEventListener("change", e => { const c = paradaCoords[e.target.value]; if (c && mapa) mapa.flyTo(c, 16); });
});