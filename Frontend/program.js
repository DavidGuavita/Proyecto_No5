const contenido = document.getElementById("contenido")

function mostrar(opcion){

if(opcion === "mapa"){
contenido.innerHTML = "Aquí se mostrará el mapa de Chapinero"
}

if(opcion === "mapsitp"){
contenido.innerHTML = "Aquí se mostrarán las paradas del SITP"
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