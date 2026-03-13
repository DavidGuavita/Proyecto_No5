const contenido = document.getElementById("contenido")

function mostrar(opcion) {
    if(opcion === "mapa"){
        contenido.innerHTML = `<div id="map" style="height:500px;"></div>`
        
        const map = L.map('map').setView([4.65, -74.05], 13)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map)
        
        fetch("http://127.0.0.1:8000/map")
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data).addTo(map)
            })
    }
    
    if(opcion === "mapsitp"){
        contenido.innerHTML = `<div id="map-sitp" style="height:500px;"></div>`
        
        const map = L.map('map-sitp').setView([4.65, -74.05], 13)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map)
        
        // Cargar polígono de Chapinero
        fetch("http://127.0.0.1:8000/map")
            .then(response => response.json())
            .then(chapinero => {
                L.geoJSON(chapinero).addTo(map)
                
                // Cargar paradas SITP
                return fetch("http://127.0.0.1:8000/sitp/chapinero")
            })
            .then(response => response.json())
            .then(paradas => {
                L.geoJSON(paradas).addTo(map)
            })
    }
    
    if(opcion === "analisis"){
        contenido.innerHTML = "Aquí irá el análisis de distancia entre paradas"
    }
}

function mostrarInfo(info){
    if(info === "area"){
        contenido.innerHTML = "Área de la localidad"
    }
    if(info === "nombre"){
        contenido.innerHTML = "Nombre de la parada"
    }
    if(info === "wiki"){
        contenido.innerHTML = "URL de Wikipedia de la parada"
    }
}

function mostrarEstacion(estacion){
    contenido.innerHTML = "Seleccionaste: " + estacion
}