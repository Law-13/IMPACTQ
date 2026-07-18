from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ConstraintBase(BaseModel):
    text: str
    type: str  # "hard" | "soft"
    status: str  # "satisfied" | "violated" | "warning"

class ConstraintCreate(ConstraintBase):
    pass

class Constraint(ConstraintBase):
    id: int
    decision_id: str

    class Config:
        from_attributes = True

class ImpactBase(BaseModel):
    text: str
    type: str  # "positive" | "negative"
    intensity: str  # "high" | "medium" | "low"

class ImpactCreate(ImpactBase):
    pass

class Impact(ImpactBase):
    id: int
    decision_id: str

    class Config:
        from_attributes = True

class AffectedAreaBase(BaseModel):
    name: str
    weight: float
    score: float
    trend: str  # "up" | "down" | "stable"

class AffectedAreaCreate(AffectedAreaBase):
    pass

class AffectedArea(AffectedAreaBase):
    id: int
    decision_id: str

    class Config:
        from_attributes = True

class DecisionCompassBase(BaseModel):
    recommendation: str
    whyThisMatters: str = Field(..., validation_alias="why_this_matters", serialization_alias="whyThisMatters")
    potentialRisks: str = Field(..., validation_alias="potential_risks", serialization_alias="potentialRisks")
    suggestedAction: str = Field(..., validation_alias="suggested_action", serialization_alias="suggestedAction")
    expectedStability: float = Field(..., validation_alias="expected_stability", serialization_alias="expectedStability")
    confidence: float

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

class DecisionCompassCreate(DecisionCompassBase):
    pass

class DecisionCompass(DecisionCompassBase):
    id: int
    decision_id: str

    class Config:
        from_attributes = True

class DecisionBase(BaseModel):
    title: str
    description: str

class DecisionCreate(DecisionBase):
    constraints: List[ConstraintCreate]
    positiveImpacts: List[ImpactCreate] = Field(..., serialization_alias="positiveImpacts")
    negativeImpacts: List[ImpactCreate] = Field(..., serialization_alias="negativeImpacts")
    affectedAreas: List[AffectedAreaCreate] = Field(..., serialization_alias="affectedAreas")
    stabilityScore: float = Field(..., serialization_alias="stabilityScore")
    decisionCompass: DecisionCompassCreate = Field(..., serialization_alias="decisionCompass")

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

class DecisionScenario(DecisionBase):
    id: str
    stabilityScore: float = Field(..., validation_alias="stability_score", serialization_alias="stabilityScore")
    created_at: datetime
    constraints: List[Constraint]
    positiveImpacts: List[Impact] = Field(..., validation_alias="positive_impacts", serialization_alias="positiveImpacts")
    negativeImpacts: List[Impact] = Field(..., validation_alias="negative_impacts", serialization_alias="negativeImpacts")
    affectedAreas: List[AffectedArea] = Field(..., validation_alias="affected_areas", serialization_alias="affectedAreas")
    decisionCompass: DecisionCompass = Field(..., validation_alias="decision_compass", serialization_alias="decisionCompass")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "by_alias": True
    }

class DecisionInput(BaseModel):
    title: str
    description: str

class SimulationBase(BaseModel):
    name: str

class SimulationCreate(SimulationBase):
    original_decision_id: str
    modified_decision_id: str

class Simulation(SimulationBase):
    id: str
    original_decision_id: str
    modified_decision_id: str
    created_at: datetime
    original_decision: Optional[DecisionScenario] = None
    modified_decision: Optional[DecisionScenario] = None

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    totalAnalyses: int = Field(..., serialization_alias="totalAnalyses")
    totalSimulations: int = Field(..., serialization_alias="totalSimulations")
    averageStability: float = Field(..., serialization_alias="averageStability")

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

# Sprint 4: Live What-If Simulation schemas
class SimulationRequest(BaseModel):
    original_decision_id: str
    modified_title: str
    modified_description: str

class TransientDecision(BaseModel):
    """A decision result that is NOT persisted to the database."""
    title: str
    description: str
    stabilityScore: float = Field(..., serialization_alias="stabilityScore")
    constraints: List[ConstraintBase]
    positiveImpacts: List[ImpactBase] = Field(..., serialization_alias="positiveImpacts")
    negativeImpacts: List[ImpactBase] = Field(..., serialization_alias="negativeImpacts")
    affectedAreas: List[AffectedAreaBase] = Field(..., serialization_alias="affectedAreas")
    decisionCompass: "TransientCompass" = Field(..., serialization_alias="decisionCompass")

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

class TransientCompass(BaseModel):
    recommendation: str
    whyThisMatters: str = Field(..., serialization_alias="whyThisMatters")
    potentialRisks: str = Field(..., serialization_alias="potentialRisks")
    suggestedAction: str = Field(..., serialization_alias="suggestedAction")
    expectedStability: float = Field(..., serialization_alias="expectedStability")
    confidence: float

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

class SimulationResult(BaseModel):
    originalDecision: DecisionScenario = Field(..., serialization_alias="originalDecision")
    modifiedDecision: TransientDecision = Field(..., serialization_alias="modifiedDecision")

    model_config = {
        "populate_by_name": True,
        "by_alias": True
    }

TransientDecision.model_rebuild()
