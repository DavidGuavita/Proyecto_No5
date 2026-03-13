const menu = document.getElementById("menu")

menu.addEventListener("change", function(){

const option = this.value

if(option === "map"){
loadMap()
}

if(option === "mapsitp"){
loadStops()
}

if(option === "stations"){
loadStations()
}

})


// -------------------------
// MAPA LOCALIDAD
// -------------------------

function loadMap(){

fetch("http://127.0.0.1:8000/map")  // ← AQUÍ se carga localidad.geojson
.then(res => res.json())
.then(data => {

console.log("Mapa localidad", data)

})

}


// -------------------------
// PARADAS SITP
// -------------------------

function loadStops(){

fetch("http://127.0.0.1:8000/stops")  // ← AQUÍ se carga paradas_sitp.geojson
.then(res => res.json())
.then(data => {

console.log("Paradas SITP", data)

})

}


// -------------------------
// ESTACIONES
// -------------------------

function loadStations(){

fetch("http://127.0.0.1:8000/stations")
.then(res => res.json())
.then(data => {

console.log("Estaciones", data)

})

}