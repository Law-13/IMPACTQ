# backend/app/generator.py
import os
import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Pydantic schemas for Gemini Structured Output
class GeminiConstraint(BaseModel):
    text: str = Field(description="The constraint or rule description.")
    type: str = Field(description="Must be 'hard' or 'soft'.")
    status: str = Field(description="Must be 'satisfied', 'violated', or 'warning'. Evaluate based on the decision context.")

class GeminiImpact(BaseModel):
    text: str = Field(description="The description of the impact.")
    type: str = Field(description="Must be 'positive' or 'negative'.")
    intensity: str = Field(description="Must be 'high', 'medium', or 'low'.")

class GeminiAffectedArea(BaseModel):
    name: str = Field(description="Name of the department or business area (e.g., 'Finance', 'Product & Eng', 'Customer Success', 'Sales & Mktg', 'Legal').")
    weight: float = Field(description="Relevance or weight of the area (e.g. 10.0 to 45.0).")
    trend: str = Field(description="The projected trend. Must be 'up', 'down', or 'stable'.")

class GeminiDecisionCompass(BaseModel):
    recommendation: str = Field(description="Clear recommended decision action (e.g., 'Approve - Staggered Implementation', 'Decline - High Churn Risk'). Max 6 words.")
    whyThisMatters: str = Field(description="Detailed explanation of why this matters.")
    potentialRisks: str = Field(description="Summary of core implementation risks.")
    suggestedAction: str = Field(description="Concrete immediate next steps.")
    confidence: float = Field(description="Confidence percentage (0 to 100).")

class GeminiDecisionOutput(BaseModel):
    constraints: List[GeminiConstraint]
    positiveImpacts: List[GeminiImpact] = Field(description="List of positive business impacts.")
    negativeImpacts: List[GeminiImpact] = Field(description="List of negative business impacts.")
    affectedAreas: List[GeminiAffectedArea] = Field(description="List of departments or areas affected.")
    decisionCompass: GeminiDecisionCompass = Field(description="Overall strategic compass evaluation.")

def calculate_stability_score(
    constraints: list,
    positive_impacts: list,
    negative_impacts: list,
    affected_areas: list = None
) -> float:
    # Deterministic Scoring Engine
    score = 100.0
    
    # 1. Evaluate constraints
    for c in constraints:
        status = c.get("status", "").lower()
        ctype = c.get("type", "").lower()
        if status == "violated":
            if ctype == "hard":
                score -= 15.0
            else:
                score -= 8.0
        elif status == "warning":
            score -= 4.0
            
    # 2. Evaluate negative impacts
    for imp in negative_impacts:
        intensity = imp.get("intensity", "").lower()
        if intensity == "high":
            score -= 6.0
        elif intensity == "medium":
            score -= 3.0
        else:
            score -= 1.5
            
    # 3. Evaluate positive impacts
    pos_bonus = 0.0
    for imp in positive_impacts:
        intensity = imp.get("intensity", "").lower()
        if intensity == "high":
            pos_bonus += 3.0
        elif intensity == "medium":
            pos_bonus += 1.5
        else:
            pos_bonus += 0.5
    # Cap positive bonus at +10
    score += min(pos_bonus, 10.0)

    # 4. Weighted area risk (NEW in Sprint 4)
    # Areas trending down proportionally hurt the score based on their weight/importance
    if affected_areas:
        for area in affected_areas:
            trend = area.get("trend", "stable").lower()
            weight = float(area.get("weight", 20.0))
            if trend == "down":
                score -= (weight / 100.0) * 5.0
            elif trend == "up":
                score += (weight / 100.0) * 2.0
    
    return max(0.0, min(100.0, round(score, 1)))

def calculate_area_score(title: str, area_name: str, trend: str) -> float:
    # Deterministic base scores per trend
    base_score = 75.0
    if trend == "up":
        base_score = 88.0
    elif trend == "down":
        base_score = 45.0
        
    # Introduce micro-fluctuations based on a hash of names so they don't look generic
    variance = (len(title) + len(area_name)) % 6 - 3 # yields -3 to +2
    return max(0.0, min(100.0, round(base_score + variance, 1)))

def generate_decision_data(title: str, description: str) -> Dict[str, Any]:
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
        
    prompt = f"""
    Analyze the following business decision:
    Title: {title}
    Description: {description}
    
    Perform a complete decision intelligence evaluation mapping hidden constraints, business impacts, affected areas, and strategic recommendations.
    """
    
    # Call Gemini model
    model = genai.GenerativeModel("gemini-3.5-flash")
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=GeminiDecisionOutput
        )
    )
    
    # Parse structured response
    raw_data = json.loads(response.text)
    
    # Extract lists
    constraints = raw_data.get("constraints", [])
    positive_impacts = raw_data.get("positiveImpacts", [])
    negative_impacts = raw_data.get("negativeImpacts", [])
    affected_areas = raw_data.get("affectedAreas", [])
    compass_data = raw_data.get("decisionCompass", {})
    
    # Calculate department/area scores deterministically
    formatted_areas = []
    for area in affected_areas:
        name = area.get("name", "Other")
        trend = area.get("trend", "stable")
        weight = area.get("weight", 20.0)
        formatted_areas.append({
            "name": name,
            "weight": weight,
            "trend": trend,
            "score": calculate_area_score(title, name, trend)
        })
        
    # Calculate stability score deterministically (now includes weighted area risk)
    stability_score = calculate_stability_score(
        constraints, positive_impacts, negative_impacts, formatted_areas
    )

    # Build complete response model
    return {
        "title": title,
        "description": description,
        "stabilityScore": stability_score,
        "constraints": constraints,
        "positiveImpacts": positive_impacts,
        "negativeImpacts": negative_impacts,
        "affectedAreas": formatted_areas,
        "decisionCompass": {
            "recommendation": compass_data.get("recommendation", "Approve with safeguards"),
            "whyThisMatters": compass_data.get("whyThisMatters", ""),
            "potentialRisks": compass_data.get("potentialRisks", ""),
            "suggestedAction": compass_data.get("suggestedAction", ""),
            "expectedStability": stability_score, # expectedStability must equal the calculated stability score
            "confidence": compass_data.get("confidence", 80.0)
        }
    }
