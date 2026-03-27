import json, os
from functools import lru_cache
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "DataBase")
app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])

@lru_cache(maxsize=None)
def leer_geojson(archivo):
    ruta = os.path.join(DB, archivo)
    if not os.path.isfile(ruta):
        raise FileNotFoundError(archivo)
    with open(ruta, encoding="utf-8") as f:
        return f.read()

def respuesta(archivo):
    try:
        return JSONResponse(content=json.loads(leer_geojson(archivo)))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/")
def home():
    return {"mensaje": "API funcionando"}

@app.get("/map")
def get_map():
    return respuesta("chapinero.geojson")

@app.get("/sitp/chapinero")
def get_sitp_chapinero():
    return respuesta("sitp_chapinero.geojson")