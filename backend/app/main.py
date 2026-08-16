from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import time
from collections import defaultdict

from .database import engine, get_db
from . import models, schemas, crud, generator

# Create SQLite tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ImpactQ Backend",
    description="Decision Intelligence Engine API",
    version="0.1.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Sliding-Window Rate Limiter
class InMemoryRateLimiter:
    def __init__(self, requests_limit: int = 60, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    def check_rate_limit(self, ip: str) -> bool:
        current_time = time.time()
        # Filter out timestamps outside the current sliding window
        self.history[ip] = [t for t in self.history[ip] if current_time - t < self.window_seconds]
        
        if len(self.history[ip]) >= self.requests_limit:
            return False
        
        self.history[ip].append(current_time)
        return True

rate_limiter = InMemoryRateLimiter(requests_limit=60, window_seconds=60)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only rate limit backend API paths
    if request.url.path.startswith("/api"):
        client_ip = request.client.host if request.client else "unknown"
        if not rate_limiter.check_rate_limit(client_ip):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."}
            )
    response = await call_next(request)
    return response

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ImpactQ API",
        "version": "0.1.0"
    }

@app.get("/api/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

@app.get("/api/decisions", response_model=List[schemas.DecisionScenario])
def get_decisions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_decisions(db, skip=skip, limit=limit)

@app.get("/api/decisions/{decision_id}", response_model=schemas.DecisionScenario)
def get_decision(decision_id: str, db: Session = Depends(get_db)):
    db_decision = crud.get_decision(db, decision_id)
    if db_decision is None:
        raise HTTPException(status_code=404, detail="Decision not found")
    return db_decision

@app.post("/api/decisions", response_model=schemas.DecisionScenario)
def create_decision(decision_input: schemas.DecisionInput, db: Session = Depends(get_db)):
    try:
        # Generate structured data using our parser engine
        generated_data = generator.generate_decision_data(
            title=decision_input.title,
            description=decision_input.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    # Save it to SQLite database
    db_decision = crud.create_decision(
        db=db,
        title=decision_input.title,
        description=decision_input.description,
        data=generated_data
    )
    return db_decision

@app.delete("/api/decisions/{decision_id}")
def delete_decision(decision_id: str, db: Session = Depends(get_db)):
    success = crud.delete_decision(db, decision_id)
    if not success:
        raise HTTPException(status_code=404, detail="Decision not found")
    return {"status": "success", "message": "Decision deleted successfully"}

@app.get("/api/simulations", response_model=List[schemas.Simulation])
def get_simulations(db: Session = Depends(get_db)):
    return crud.get_simulations(db)

@app.post("/api/simulations", response_model=schemas.Simulation)
def create_simulation(sim_input: schemas.SimulationCreate, db: Session = Depends(get_db)):
    original_decision = crud.get_decision(db, sim_input.original_decision_id)
    modified_decision = crud.get_decision(db, sim_input.modified_decision_id)
    
    if not original_decision or not modified_decision:
        raise HTTPException(status_code=404, detail="Original or Modified decision not found")
        
    db_sim = crud.create_simulation(
        db=db,
        name=sim_input.name,
        original_id=sim_input.original_decision_id,
        modified_id=sim_input.modified_decision_id
    )
    return db_sim

@app.post("/api/simulate", response_model=schemas.SimulationResult)
def run_live_simulation(sim_request: schemas.SimulationRequest, db: Session = Depends(get_db)):
    """
    Sprint 4: Live What-If Simulation.
    Fetches the original decision from the database, then uses Gemini to analyze
    the modified scenario. Returns both side-by-side. Does NOT persist modified decision.
    """
    # 1. Fetch original from DB
    original_decision = crud.get_decision(db, sim_request.original_decision_id)
    if not original_decision:
        raise HTTPException(status_code=404, detail="Original decision not found")

    # 2. Generate modified scenario via Gemini + deterministic scoring (not saved to DB)
    try:
        modified_data = generator.generate_decision_data(
            title=sim_request.modified_title,
            description=sim_request.modified_description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # 3. Build TransientDecision from raw dict
    modified_decision = schemas.TransientDecision(
        title=modified_data["title"],
        description=modified_data["description"],
        stabilityScore=modified_data["stabilityScore"],
        constraints=modified_data["constraints"],
        positiveImpacts=modified_data["positiveImpacts"],
        negativeImpacts=modified_data["negativeImpacts"],
        affectedAreas=modified_data["affectedAreas"],
        decisionCompass=schemas.TransientCompass(
            recommendation=modified_data["decisionCompass"]["recommendation"],
            whyThisMatters=modified_data["decisionCompass"]["whyThisMatters"],
            potentialRisks=modified_data["decisionCompass"]["potentialRisks"],
            suggestedAction=modified_data["decisionCompass"]["suggestedAction"],
            expectedStability=modified_data["decisionCompass"]["expectedStability"],
            confidence=modified_data["decisionCompass"]["confidence"]
        )
    )

    return schemas.SimulationResult(
        originalDecision=original_decision,
        modifiedDecision=modified_decision
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
