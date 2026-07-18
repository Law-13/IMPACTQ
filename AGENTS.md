# AGENTS.md — ImpactQ Engineering Guide

## Project
**Product:** ImpactQ
**Tagline:** See the impact of your decisions before making them.

ImpactQ is a Decision Intelligence platform that analyzes decisions using structured reasoning, deterministic scoring, and simulations.

## Mission
Build ImpactQ like a production SaaS startup.

Priorities:
1. Correctness
2. Maintainability
3. Reusability
4. Simplicity
5. Performance

## MVP Scope
Pages:
- Landing
- Dashboard
- Analyze
- Simulation
- Settings

Features:
- Decision Input
- Constraint Analysis
- Positive/Negative Impacts
- Affected Areas
- Stability Score
- Decision Compass
- Simulation
- History

Do NOT build:
- Authentication
- Payments
- Notifications
- Chat
- Admin Panel
- User Profiles
- Team Collaboration

## Branding
Use the provided ImpactQ logo.
Never redesign it.

## Tech Stack
Frontend:
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Recharts
- Lucide React

Backend:
- FastAPI
- Python
- SQLAlchemy
- SQLite
- Gemini API

## Design Language
Inspired by:
- Linear
- Stripe
- GitHub
- Notion
- Vercel
- Apple

Avoid:
- Neon
- Glassmorphism
- Robot graphics
- AI-themed effects
- Huge marketing pages

## Color Palette
Background: #FAFAFA
Surface: #FFFFFF
Text: #111827
Secondary: #6B7280
Border: #E5E7EB
Accent: #2563EB
Success: #16A34A
Danger: #DC2626

## Components
Logo
Navbar
Sidebar
PageHeader
DecisionInput
AnalyzeButton
ConstraintCard
ImpactCard
AffectedAreaCard
StabilityGauge
DecisionCompassCard
HistoryCard
SimulationComparison
LoadingSkeleton
EmptyState
ErrorState

## AI Rules
AI may:
- Find constraints
- Find impacts
- Map affected areas
- Explain reasoning

AI must NOT:
- Calculate stability
- Apply business logic
- Generate random scores

Backend calculates all scores deterministically.

## Decision Compass
Always display:
- Recommended Decision
- Reasoning
- Expected Stability
- Confidence
- Suggested Next Step

Never call it AI Recommendation.

## Coding Standards
- Strict TypeScript
- Reusable components
- No duplicate code
- No inline styles
- Modular architecture
- Environment variables for secrets

## Sprint Plan
Sprint 1: Frontend with mock data
Sprint 2: Backend APIs
Sprint 3: AI Integration
Sprint 4: Stability & Simulation
Sprint 5: Testing & Deployment

## Definition of Done
- Builds successfully
- No TypeScript errors
- No lint errors
- Responsive
- Accessible
- Ready for the next sprint
