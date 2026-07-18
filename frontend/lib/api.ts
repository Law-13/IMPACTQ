import { DecisionScenario } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DashboardStats {
  totalAnalyses: number;
  totalSimulations: number;
  averageStability: number;
}

export interface Simulation {
  id: string;
  name: string;
  original_decision_id: string;
  modified_decision_id: string;
  created_at: string;
  original_decision?: DecisionScenario;
  modified_decision?: DecisionScenario;
}

// Sprint 4: Transient modified decision (not persisted to DB)
export interface TransientDecision {
  title: string;
  description: string;
  stabilityScore: number;
  constraints: { text: string; type: string; status: string }[];
  positiveImpacts: { text: string; type: string; intensity: string }[];
  negativeImpacts: { text: string; type: string; intensity: string }[];
  affectedAreas: { name: string; weight: number; score: number; trend: string }[];
  decisionCompass: {
    recommendation: string;
    whyThisMatters: string;
    potentialRisks: string;
    suggestedAction: string;
    expectedStability: number;
    confidence: number;
  };
}

export interface SimulationResult {
  originalDecision: DecisionScenario;
  modifiedDecision: TransientDecision;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  fetchStats: () => request<DashboardStats>("/api/stats"),
  
  fetchDecisions: () => request<DecisionScenario[]>("/api/decisions"),
  
  fetchDecision: (id: string) => request<DecisionScenario>(`/api/decisions/${id}`),
  
  analyzeDecision: (title: string, description: string) => 
    request<DecisionScenario>("/api/decisions", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    }),
    
  deleteDecision: (id: string) => 
    request<{ status: string; message: string }>(`/api/decisions/${id}`, {
      method: "DELETE",
    }),
    
  fetchSimulations: () => request<Simulation[]>("/api/simulations"),
  
  createSimulation: (name: string, original_decision_id: string, modified_decision_id: string) =>
    request<Simulation>("/api/simulations", {
      method: "POST",
      body: JSON.stringify({ name, original_decision_id, modified_decision_id }),
    }),

  // Sprint 4: Live What-If Simulation
  runSimulation: (originalDecisionId: string, modifiedTitle: string, modifiedDescription: string) =>
    request<SimulationResult>("/api/simulate", {
      method: "POST",
      body: JSON.stringify({
        original_decision_id: originalDecisionId,
        modified_title: modifiedTitle,
        modified_description: modifiedDescription,
      }),
    }),
};

