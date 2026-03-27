const API = "http://127.0.0.1:8000";
let mapa = null;
let paradaCoords = {};
const contenido = document.getElementById("contenido");
const selectEstacion = document.getElementById("select-estacion");

function haversine(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0]-a[0])*r, dLon = (b[1]-a[1])*r;
    const h = Math.sin(dLat/2)**2 + Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)**2;
    return (2*R*Math.asin(Math.sqrt(h))).toFixed(2);
}

function limpiar(html) {
    if (mapa) { mapa.remove(); mapa = null; }
    contenido.innerHTML = html;
}

function crearMapa(id) {
    const m = L.map(id).setView([4.65, -74.05], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
    return m;
}

function llenarSelect(sel, placeholder) {
    sel.innerHTML = `<option value="">${placeholder}</option>`;
    Object.keys(paradaCoords).sort().forEach(n => {
        const opt = document.createElement("option");
        opt.value = n; opt.textContent = n;
        sel.appendChild(opt);
    });
}

function cargarChapinero(m) {
    return fetch(API + "/map").then(r => r.json()).then(d => L.geoJSON(d).addTo(m));
}

function cargarSITP(m) {
    return fetch(API + "/sitp/chapinero").then(r => r.json()).then(d => {
        paradaCoords = {};
        d.features.forEach((f, i) => {
            let nombre = f.properties.name?.trim() || `Paradero ${i + 1}`;
            if (paradaCoords[nombre]) {
                let k = 2;
                while (paradaCoords[`${nombre} (${k})`]) k++;
                nombre = `${nombre} (${k})`;
            }
            const [lon, lat] = f.geometry.coordinates;
            paradaCoords[nombre] = [lat, lon];
        });
        llenarSelect(selectEstacion, "Estaciones");
        L.geoJSON(d, {
            onEachFeature: (f, layer) => {
                const nombre = f.properties.name?.trim() || "Sin nombre";
                const wiki = `https://es.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent("SITP " + nombre + " Bogotá")}`;
                layer.bindPopup(`<strong>${nombre}</strong><br><a href="${wiki}" target="_blank">🔗 Wikipedia</a>`);
            }
        }).addTo(m);
    });
}

function mostrar(op) {
    if (op === "mapa") {
        limpiar('<div id="map" style="height:500px"></div>');
        mapa = crearMapa("map");
        cargarChapinero(mapa).catch(() => limpiar('<p class="error">Error cargando mapa.</p>'));
    }
    if (op === "mapsitp") {
        limpiar('<div id="map-sitp" style="height:500px"></div>');
        mapa = crearMapa("map-sitp");
        cargarChapinero(mapa);
        cargarSITP(mapa).catch(() => limpiar('<p class="error">Error cargando SITP.</p>'));
    }
    if (op === "analisis") {
        limpiar(`
            <div class="analisis-bar">
                <select id="pto-a"><option value="">Parada A</option></select>
                <select id="pto-b"><option value="">Parada B</option></select>
                <span id="info-dist"></span>
            </div>
            <div id="map-analisis" style="height:440px"></div>
        `);
        mapa = crearMapa("map-analisis");
        cargarChapinero(mapa);
        let linea = null;

        cargarSITP(mapa).then(() => {
            const selA = document.getElementById("pto-a");
            const selB = document.getElementById("pto-b");
            llenarSelect(selA, "Parada A");
            llenarSelect(selB, "Parada B");

            function calcular() {
                const a = paradaCoords[selA.value];
                const b = paradaCoords[selB.value];
                if (!a || !b) return;
                if (linea) mapa.removeLayer(linea);
                linea = L.polyline([a, b], { color: "#e74c3c", weight: 3 }).addTo(mapa);
                mapa.fitBounds(linea.getBounds(), { padding: [40, 40] });
                document.getElementById("info-dist").textContent = `📏 ${haversine(a, b)} km`;
            }

            selA.addEventListener("change", calcular);
            selB.addEventListener("change", calcular);
        });
    }
}

function mostrarEstacion(nombre) {
    if (!nombre || !mapa || !paradaCoords[nombre]) return;
    mapa.flyTo(paradaCoords[nombre], 16);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-mapa").addEventListener("click", () => mostrar("mapa"));
    document.getElementById("btn-mapsitp").addEventListener("click", () => mostrar("mapsitp"));
    document.getElementById("btn-analisis").addEventListener("click", () => mostrar("analisis"));
    selectEstacion.addEventListener("change", e => mostrarEstacion(e.target.value));
});