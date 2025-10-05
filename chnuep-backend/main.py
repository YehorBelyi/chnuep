from fastapi import FastAPI
import uvicorn
app = FastAPI()

@app.get("/", summary="Главная ручка", tags=["Основные ручки"])
def root():
    return "Hello World"

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, debug=True)
