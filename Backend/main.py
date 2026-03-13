from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from math import radians, sin, cos, sqrt, atan2

app = FastAPI()

# Permite que el frontend (HTML/JS) llame la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# MAPA DE LA LOCALIDAD
# ------------------------

@app.get("/map")
def get_map():

    with open("../Database/Localidad Chapinero.geojson", encoding="utf-8") as f:
        data = json.load(f)

    return data


# ------------------------
# PARADAS SITP
# ------------------------

@app.get("/stops")
def get_stops():

    with open("../Database/paradas_sitp.geojson", encoding="utf-8") as f:
        data = json.load(f)

    return data


# ------------------------
# INFORMACION PARADA
# ------------------------

@app.get("/info")
def stop_info(nombre: str):

    return {
        "area": "",
        "nombre": nombre,
        "wiki": f"https://es.wikipedia.org/wiki/{nombre}"
    }


# ------------------------
# ESTACIONES (lista)
# ------------------------

@app.get("/stations")
def stations():

    with open("../database/paradas_sitp.geojson", encoding="utf-8") as f:
        data = json.load(f)

    estaciones = []

    for parada in data["features"]:
        estaciones.append(parada["properties"]["name"])

    return estaciones


# ------------------------
# ANALISIS DISTANCIA
# ------------------------

def haversine(lat1, lon1, lat2, lon2):

    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    return R * c


@app.get("/analysis")
def analysis(lat1: float, lon1: float, lat2: float, lon2: float):

    distance = haversine(lat1, lon1, lat2, lon2)

    return {
        "distance_km": distance
    }