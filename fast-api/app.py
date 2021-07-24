from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
from CF import CF
from CS import CS
app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# CS
data = pd.read_json("all.json")
rs1 = CS(data)
rs1.fit()

# CF

ratings = pd.read_csv('data.csv')
Y_data = ratings.to_numpy()

rs2 = CF(Y_data, k = 2)
rs2.fit()
@app.get("/CS")
async def root(id: int = 1, limit: int = 10):
    
    res = rs1.recommendations(id, limit)
    return {"CS": res}

@app.get("/CF")
async def root(id: int = 1):
    
    res = rs2.predict(id)
    return {"CF": res}


