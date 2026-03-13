from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"mensaje": "API funcionando"}

@app.get("/map")
def get_map():
    with open("../DataBase/chapinero.geojson", encoding="utf-8") as f:
        return json.load(f)

@app.get("/sitp")
def get_sitp():
    with open("../DataBase/sitp.geojson", encoding="utf-8") as f:
        return json.load(f)

@app.get("/sitp/chapinero")
def get_sitp_chapinero():
    with open("../DataBase/sitp_chapinero.geojson", encoding="utf-8") as f:
        return json.load(f)