from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    stability_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    constraints = relationship("ConstraintModel", back_populates="decision", cascade="all, delete-orphan")
    impacts = relationship("ImpactModel", back_populates="decision", cascade="all, delete-orphan")
    affected_areas = relationship("AffectedAreaModel", back_populates="decision", cascade="all, delete-orphan")
    decision_compass = relationship("DecisionCompassModel", back_populates="decision", uselist=False, cascade="all, delete-orphan")

    @property
    def positive_impacts(self):
        return [imp for imp in self.impacts if imp.type == "positive"]

    @property
    def negative_impacts(self):
        return [imp for imp in self.impacts if imp.type == "negative"]


class ConstraintModel(Base):
    __tablename__ = "constraints"

    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False)
    text = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "hard" | "soft"
    status = Column(String, nullable=False)  # "satisfied" | "violated" | "warning"

    decision = relationship("Decision", back_populates="constraints")

class ImpactModel(Base):
    __tablename__ = "impacts"

    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False)
    text = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "positive" | "negative"
    intensity = Column(String, nullable=False)  # "high" | "medium" | "low"

    decision = relationship("Decision", back_populates="impacts")

class AffectedAreaModel(Base):
    __tablename__ = "affected_areas"

    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    weight = Column(Float, nullable=False)
    score = Column(Float, nullable=False)
    trend = Column(String, nullable=False)  # "up" | "down" | "stable"

    decision = relationship("Decision", back_populates="affected_areas")

class DecisionCompassModel(Base):
    __tablename__ = "decision_compasses"

    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id", ondelete="CASCADE"), unique=True, nullable=False)
    recommendation = Column(String, nullable=False)
    why_this_matters = Column(String, nullable=False)
    potential_risks = Column(String, nullable=False)
    suggested_action = Column(String, nullable=False)
    expected_stability = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)

    decision = relationship("Decision", back_populates="decision_compass")

class SimulationModel(Base):
    __tablename__ = "simulations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    original_decision_id = Column(String, ForeignKey("decisions.id", ondelete="SET NULL"), nullable=True)
    modified_decision_id = Column(String, ForeignKey("decisions.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    original_decision = relationship("Decision", foreign_keys=[original_decision_id])
    modified_decision = relationship("Decision", foreign_keys=[modified_decision_id])
