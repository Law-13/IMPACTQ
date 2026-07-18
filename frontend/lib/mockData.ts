export interface Constraint {
  text: string;
  type: "hard" | "soft";
  status: "satisfied" | "violated" | "warning";
}

export interface Impact {
  text: string;
  type: "positive" | "negative";
  intensity: "high" | "medium" | "low";
}

export interface AffectedArea {
  name: string;
  weight: number; // 0-100 percentage contribution
  score: number;  // 0-100 stability score for area
  trend: "up" | "down" | "stable";
}

export interface DecisionCompass {
  recommendation: string;
  whyThisMatters: string;
  potentialRisks: string;
  suggestedAction: string;
  expectedStability: number;
  confidence: number; // 0-100
}

export interface DecisionScenario {
  id: string;
  title: string;
  description: string;
  constraints: Constraint[];
  positiveImpacts: Impact[];
  negativeImpacts: Impact[];
  affectedAreas: AffectedArea[];
  stabilityScore: number;
  decisionCompass: DecisionCompass;
}

export const mockScenarios: DecisionScenario[] = [
  {
    id: "pricing",
    title: "Increase subscription pricing by 10%",
    description: "Adjusting pricing across all SaaS tiers by 10% to boost average contract value (ACV) and support R&D investment.",
    stabilityScore: 78,
    constraints: [
      { text: "Do not exceed a 15% pricing increase to avoid major client backlash (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Must maintain a churn rate under 5% during transition (Soft Target)", type: "soft", status: "warning" },
      { text: "Keep legal compliance in line with localization policies in all regions (Hard Limit)", type: "hard", status: "satisfied" }
    ],
    positiveImpacts: [
      { text: "Direct 8-9% increase in average recurring revenue per user (ARPU)", type: "positive", intensity: "high" },
      { text: "Secures incremental budget for accelerating high-priority product features", type: "positive", intensity: "medium" },
      { text: "Signals product maturity and premium value to Enterprise prospects", type: "positive", intensity: "low" }
    ],
    negativeImpacts: [
      { text: "Expected 2-3% increase in churn among price-sensitive SMB tiers", type: "negative", intensity: "medium" },
      { text: "Temporary spike in customer support workload during billing migration", type: "negative", intensity: "low" },
      { text: "Risk of competitor pricing exploitation in lower market segments", type: "negative", intensity: "medium" }
    ],
    affectedAreas: [
      { name: "Finance", weight: 30, score: 92, trend: "up" },
      { name: "Customer Success", weight: 25, score: 62, trend: "down" },
      { name: "Sales & Marketing", weight: 25, score: 75, trend: "stable" },
      { name: "Product & Engineering", weight: 20, score: 85, trend: "up" }
    ],
    decisionCompass: {
      recommendation: "Proceed with Tiered Migration Plan",
      whyThisMatters: "A 10% pricing increase significantly boosts margins with manageable churn, directly funding core product improvements. However, SMB customers will bear the highest friction, requiring high-touch support or legacy grandfathering.",
      potentialRisks: "Higher churn in self-service tiers and competitive marketing campaigns targeting displaced customers.",
      suggestedAction: "Grandfather existing enterprise clients for 6 months, communicate the change 30 days in advance highlighting new features, and closely monitor CS queues.",
      expectedStability: 78,
      confidence: 85
    }
  },
  {
    id: "expand",
    title: "Expand into a new country",
    description: "Launch regional marketing campaigns, establish localized compliance frameworks, and hire a local sales lead to expand our customer base in a new international market.",
    stabilityScore: 54,
    constraints: [
      { text: "Must establish localized data residency standards (GDPR/Equivalent) (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Initial setup budget capped at $500k (Hard Limit)", type: "hard", status: "warning" },
      { text: "First sales hires must be completed within 60 days (Soft Target)", type: "soft", status: "violated" }
    ],
    positiveImpacts: [
      { text: "Unlocks an untapped addressable market of over 10,000 corporate prospects", type: "positive", intensity: "high" },
      { text: "Enhances brand presence and credentials as a global SaaS solution", type: "positive", intensity: "medium" },
      { text: "Diversifies revenue stream, reducing vulnerability to single-market downturns", type: "positive", intensity: "medium" }
    ],
    negativeImpacts: [
      { text: "Heavy legal overhead to comply with local tax, employment, and data laws", type: "negative", intensity: "high" },
      { text: "Strain on current engineering teams to deliver localization and translations", type: "negative", intensity: "medium" },
      { text: "High client acquisition cost (CAC) expected in the first two quarters", type: "negative", intensity: "high" }
    ],
    affectedAreas: [
      { name: "Legal & Compliance", weight: 30, score: 35, trend: "down" },
      { name: "Finance", weight: 25, score: 58, trend: "down" },
      { name: "Sales & Marketing", weight: 25, score: 70, trend: "up" },
      { name: "Product & Engineering", weight: 20, score: 65, trend: "stable" }
    ],
    decisionCompass: {
      recommendation: "Defer Expansion Pending Regulatory Signoff",
      whyThisMatters: "Entering this market unlocks major growth potential but introduces significant regulatory complexity. The current setup budget is strained, and engineering resources are not yet aligned for deep localization, making immediate launch high-risk.",
      potentialRisks: "Hefty non-compliance penalties, delayed launch dates, and high initial cash burn with slow early adoption.",
      suggestedAction: "Hire a dedicated localized compliance consultant first, establish data hosting infrastructure, and delay the sales hiring push until Q3.",
      expectedStability: 54,
      confidence: 90
    }
  },
  {
    id: "hiring",
    title: "Hire additional developers",
    description: "Adding 12 full-time software engineers and 3 product managers to accelerate the roadmap and address technical debt.",
    stabilityScore: 82,
    constraints: [
      { text: "Annualized salary expenditure must stay within $2.2M (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Onboarding overhead must not reduce existing team output by >15% in Month 1 (Soft Target)", type: "soft", status: "warning" },
      { text: "Must maintain 80%+ retention of current engineering staff (Hard Limit)", type: "hard", status: "satisfied" }
    ],
    positiveImpacts: [
      { text: "Estimated 40% increase in product development velocity in 3-6 months", type: "positive", intensity: "high" },
      { text: "Dedicated capacity to pay down tech debt and improve app performance", type: "positive", intensity: "medium" },
      { text: "Reduces burnout risk for current engineering staff by distributing load", type: "positive", intensity: "high" }
    ],
    negativeImpacts: [
      { text: "Immediate increase in monthly cash burn and reduced short-term runway", type: "negative", intensity: "high" },
      { text: "Senior engineers must divert substantial time to onboarding and training", type: "negative", intensity: "medium" },
      { text: "Increased communication complexity and potential alignment friction", type: "negative", intensity: "low" }
    ],
    affectedAreas: [
      { name: "Product & Engineering", weight: 40, score: 88, trend: "up" },
      { name: "Finance", weight: 30, score: 72, trend: "down" },
      { name: "Human Resources", weight: 20, score: 85, trend: "stable" },
      { name: "Operations", weight: 10, score: 80, trend: "stable" }
    ],
    decisionCompass: {
      recommendation: "Approve - Execute with Staggered Onboarding",
      whyThisMatters: "Adding engineers is critical to delivering on the strategic roadmap and reducing burnout. The financial runway allows for it, though short-term engineering velocity will dip slightly due to onboarding friction.",
      potentialRisks: "Short-term drop in feature delivery, integration friction, and communication overhead.",
      suggestedAction: "Onboard hires in cohorts of 5 over three months, assign dedicated mentors, and document key architecture schemas immediately.",
      expectedStability: 82,
      confidence: 95
    }
  },
  {
    id: "product",
    title: "Launch a new product",
    description: "Launch an enterprise-grade AI analytics addon for existing users to drive upsells and capture market share in advanced analytics.",
    stabilityScore: 68,
    constraints: [
      { text: "Launch date must align with the annual customer conference in November (Soft Target)", type: "soft", status: "warning" },
      { text: "Must pass strict internal security audits before public release (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Cost of goods sold (COGS) must remain below 20% of revenue (Hard Limit)", type: "hard", status: "satisfied" }
    ],
    positiveImpacts: [
      { text: "Provides a powerful upsell channel, expected to increase expansion ARR by 15%", type: "positive", intensity: "high" },
      { text: "Attracts enterprise buyers who require advanced decision-intelligence features", type: "positive", intensity: "high" },
      { text: "Positions the brand as an innovative leader in decision automation", type: "positive", intensity: "medium" }
    ],
    negativeImpacts: [
      { text: "Diverts 60% of core engineering capacity from platform maintenance", type: "negative", intensity: "high" },
      { text: "Higher cloud infrastructure costs from intensive computational models", type: "negative", intensity: "medium" },
      { text: "Complex support training required for sales and customer success teams", type: "negative", intensity: "medium" }
    ],
    affectedAreas: [
      { name: "Product & Engineering", weight: 35, score: 62, trend: "down" },
      { name: "Sales & Marketing", weight: 25, score: 85, trend: "up" },
      { name: "Operations & Infrastructure", weight: 20, score: 60, trend: "down" },
      { name: "Finance", weight: 20, score: 72, trend: "stable" }
    ],
    decisionCompass: {
      recommendation: "Proceed with Beta Launch Focus",
      whyThisMatters: "The product expansion is highly profitable and drives up market positioning. However, launching to all clients immediately without stabilization could degrade performance on the core product.",
      potentialRisks: "Infrastructure cost scaling, core platform feature delays, and customer frustration if beta features are unstable.",
      suggestedAction: "Release to a closed beta group of 20 clients first, establish infrastructure caps, and run dedicated sales enablement training.",
      expectedStability: 68,
      confidence: 80
    }
  },
  {
    id: "costs",
    title: "Reduce operational costs",
    description: "Consolidating duplicate software licenses, renegotiating cloud hosting agreements, and moving to a hybrid-remote office structure.",
    stabilityScore: 88,
    constraints: [
      { text: "Do not reduce service level agreements (SLA) below 99.9% uptime (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Achieve annualized savings of at least $400k (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Minimize disruption to day-to-day employee operations (Soft Target)", type: "soft", status: "satisfied" }
    ],
    positiveImpacts: [
      { text: "Saves $450k annually, expanding business runway by 5 months", type: "positive", intensity: "high" },
      { text: "Streamlines internal tooling, reducing technical and administrative bloat", type: "positive", intensity: "medium" },
      { text: "Provides positive signals to investors regarding fiscal discipline", type: "positive", intensity: "medium" }
    ],
    negativeImpacts: [
      { text: "Initial team dissatisfaction regarding hybrid-remote transition and tool changes", type: "negative", intensity: "low" },
      { text: "Time overhead to audit, migrate databases, and cancel long-standing contracts", type: "negative", intensity: "medium" },
      { text: "Slight decrease in vendor support speeds due to cheaper service tiers", type: "negative", intensity: "low" }
    ],
    affectedAreas: [
      { name: "Finance", weight: 35, score: 95, trend: "up" },
      { name: "Operations", weight: 30, score: 88, trend: "up" },
      { name: "Human Resources", weight: 20, score: 75, trend: "stable" },
      { name: "Product & Engineering", weight: 15, score: 85, trend: "stable" }
    ],
    decisionCompass: {
      recommendation: "Approve and Execute Immediately",
      whyThisMatters: "This cost reduction plan is highly stable and generates substantial savings with minimal operational risk. Tool consolidation reduces developer overhead rather than hindering speed.",
      potentialRisks: "Minor employee adjustment period to the new office footprint and software migrations.",
      suggestedAction: "Announce the remote policy changes with 60 days' notice, consolidate Slack/Teams apps, and renegotiate AWS savings plans immediately.",
      expectedStability: 88,
      confidence: 95
    }
  }
];

export function getScenarioByInput(input: string): DecisionScenario {
  const normalized = input.toLowerCase();
  
  if (normalized.includes("price") || normalized.includes("pricing") || normalized.includes("subscription")) {
    return mockScenarios[0];
  }
  if (normalized.includes("expand") || normalized.includes("country") || normalized.includes("international") || normalized.includes("market")) {
    return mockScenarios[1];
  }
  if (normalized.includes("hire") || normalized.includes("developer") || normalized.includes("engineer") || normalized.includes("recru") || normalized.includes("employe")) {
    return mockScenarios[2];
  }
  if (normalized.includes("launch") || normalized.includes("product") || normalized.includes("premium")) {
    return mockScenarios[3];
  }
  if (normalized.includes("reduce") || normalized.includes("cost") || normalized.includes("expense") || normalized.includes("overhead")) {
    return mockScenarios[4];
  }
  
  // Default to pricing scenario if no match, customized title
  const defaultScenario = { ...mockScenarios[0] };
  defaultScenario.title = input.length > 60 ? input.substring(0, 57) + "..." : input;
  return defaultScenario;
}
