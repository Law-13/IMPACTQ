# backend/app/crud.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from datetime import datetime

def get_decisions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Decision).order_by(models.Decision.created_at.desc()).offset(skip).limit(limit).all()

def get_decision(db: Session, decision_id: str):
    return db.query(models.Decision).filter(models.Decision.id == decision_id).first()

def create_decision(db: Session, title: str, description: str, data: dict):
    # Create the Decision record
    db_decision = models.Decision(
        title=title,
        description=description,
        stability_score=data["stabilityScore"]
    )
    db.add(db_decision)
    db.flush() # Flush to populate db_decision.id

    # Create constraints
    for c in data["constraints"]:
        db_constraint = models.ConstraintModel(
            decision_id=db_decision.id,
            text=c["text"],
            type=c["type"],
            status=c["status"]
        )
        db.add(db_constraint)

    # Create impacts
    for imp in data["positiveImpacts"] + data["negativeImpacts"]:
        db_impact = models.ImpactModel(
            decision_id=db_decision.id,
            text=imp["text"],
            type=imp["type"],
            intensity=imp["intensity"]
        )
        db.add(db_impact)

    # Create affected areas
    for area in data["affectedAreas"]:
        db_area = models.AffectedAreaModel(
            decision_id=db_decision.id,
            name=area["name"],
            weight=area["weight"],
            score=area["score"],
            trend=area["trend"]
        )
        db.add(db_area)

    # Create decision compass
    compass = data["decisionCompass"]
    db_compass = models.DecisionCompassModel(
        decision_id=db_decision.id,
        recommendation=compass["recommendation"],
        why_this_matters=compass["whyThisMatters"],
        potential_risks=compass["potentialRisks"],
        suggested_action=compass["suggestedAction"],
        expected_stability=compass["expectedStability"],
        confidence=compass["confidence"]
    )
    db.add(db_compass)

    db.commit()
    db.refresh(db_decision)
    return db_decision

def delete_decision(db: Session, decision_id: str):
    db_decision = db.query(models.Decision).filter(models.Decision.id == decision_id).first()
    if db_decision:
        db.delete(db_decision)
        db.commit()
        return True
    return False

def get_simulations(db: Session):
    return db.query(models.SimulationModel).order_by(models.SimulationModel.created_at.desc()).all()

def create_simulation(db: Session, name: str, original_id: str, modified_id: str):
    db_sim = models.SimulationModel(
        name=name,
        original_decision_id=original_id,
        modified_decision_id=modified_id
    )
    db.add(db_sim)
    db.commit()
    db.refresh(db_sim)
    return db_sim

def get_dashboard_stats(db: Session):
    total_analyses = db.query(func.count(models.Decision.id)).scalar()
    total_simulations = db.query(func.count(models.SimulationModel.id)).scalar()
    
    avg_stability = db.query(func.avg(models.Decision.stability_score)).scalar()
    avg_stability = float(avg_stability) if avg_stability is not None else 0.0

    return {
        "totalAnalyses": total_analyses,
        "totalSimulations": total_simulations,
        "averageStability": round(avg_stability, 1)
    }
