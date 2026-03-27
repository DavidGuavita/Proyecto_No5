const API = "http://127.0.0.1:8000";
let mapa = null;
const contenido = document.getElementById("contenido");

function limpiar(html) {
    if (mapa) { mapa.remove(); mapa = null; }
    contenido.innerHTML = html;
}

function crearMapa(id) {
    const m = L.map(id).setView([4.65, -74.05], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
    return m;
}

function cargarCapa(m, ruta) {
    return fetch(API + ruta).then(r => r.json()).then(d => L.geoJSON(d).addTo(m));
}

function mostrar(op) {
    if (op === "mapa") {
        limpiar('<div id="map" style="height:500px"></div>');
        mapa = crearMapa("map");
        cargarCapa(mapa, "/map").catch(() => limpiar('<p class="error">Error cargando mapa.</p>'));
    }
    if (op === "mapsitp") {
        limpiar('<div id="map-sitp" style="height:500px"></div>');
        mapa = crearMapa("map-sitp");
        Promise.all([cargarCapa(mapa, "/map"), cargarCapa(mapa, "/sitp/chapinero")])
            .catch(() => limpiar('<p class="error">Error cargando SITP.</p>'));
    }
    if (op === "analisis") {
        limpiar("<p>Análisis de distancia entre paradas.</p>");
    }
}

function mostrarInfo(v) {
    const info = { area: "Área de Chapinero.", nombre: "Nombre de la parada.", wiki: "Wikipedia de la localidad." };
    if (info[v]) limpiar(`<p>${info[v]}</p>`);
}

function mostrarEstacion(v) {
    if (v) limpiar(`<p>Estación seleccionada: <strong>${v}</strong></p>`);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-mapa").addEventListener("click", () => mostrar("mapa"));
    document.getElementById("btn-mapsitp").addEventListener("click", () => mostrar("mapsitp"));
    document.getElementById("btn-analisis").addEventListener("click", () => mostrar("analisis"));
    document.getElementById("select-info").addEventListener("change", e => mostrarInfo(e.target.value));
    document.getElementById("select-estacion").addEventListener("change", e => mostrarEstacion(e.target.value));
});