import { Activity, Cpu, ShieldAlert, SlidersHorizontal, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

/** Copy for the NEXUS review page (positioning brief, 3 Nov 2026). Not linked from the site and not indexed. */

export const nexus = {
  name: "Business Brain NEXUS",
  descriptor: "Enterprise Intelligence & Decision Command Centre",
  tagline: ["One Intelligence.", "Every Decision.", "Total Business Visibility."],
  uvp: "One AI command centre that turns live operational data into predictions, simulated scenarios and decisions you can act on. Every business function, in one intelligent environment.",
  positioning: ["Beyond dashboards. Beyond reporting.", "From business visibility to intelligent business decisions."],
};

export type Capability = { id: string; Icon: LucideIcon; name: string; line: string; body: string };

/** The six capabilities NEXUS is organised around, in the order a decision flows through them. */
export const capabilities: Capability[] = [
  { id: "pulse", Icon: Activity, name: "Enterprise Pulse", line: "Live KPIs and cross-functional business health",
    body: "Sales, stock, production, cash and people on one live board. Each number carries its one-line cause." },
  { id: "sentinel", Icon: ShieldAlert, name: "Risk Sentinel", line: "Early warnings, anomaly detection and escalation",
    body: "Watches every ledger and stream for the odd movement. Flags it early and escalates to the person who owns it." },
  { id: "foresight", Icon: TrendingUp, name: "Predictive Foresight", line: "Demand, cash flow and operational risk forecasting",
    body: "Forecasts demand by depot, cash by bank and risk by line, so you see the shortfall weeks before it lands." },
  { id: "simulator", Icon: SlidersHorizontal, name: "Scenario Simulator", line: "What-if planning with measurable business impact",
    body: "Change a price, a cost or a payment term and see revenue, margin and cash move before you commit." },
  { id: "decision", Icon: Sparkles, name: "AI Decision Engine", line: "Intelligent recommendations and approval workflows",
    body: "Turns what it sees into a proposal with reasons and records. You approve, change or reject it in one tap." },
  { id: "agents", Icon: Cpu, name: "Agent Command", line: "Coordinate AI agents across enterprise functions",
    body: "Procurement, collections, dispatch and close agents work as one team, through the same approvals people use." },
];

/** Signal to decision: how the six capabilities hand work to each other. */
export const flow = [
  { verb: "Sense", by: "Enterprise Pulse", text: "Live figures from every function." },
  { verb: "Flag", by: "Risk Sentinel", text: "The odd movement, caught early." },
  { verb: "Predict", by: "Predictive Foresight", text: "Where it goes if nothing changes." },
  { verb: "Test", by: "Scenario Simulator", text: "Each option, priced out." },
  { verb: "Decide", by: "AI Decision Engine", text: "One proposal, with reasons." },
  { verb: "Act", by: "Agent Command", text: "Agents carry it out, after your yes." },
];

/** Naming options from the brief, kept here for review only. */
export const alternatives = [
  { name: "SENTINEL", tagline: "See Risks Early. Act Before They Happen.", identity: "Predictive monitoring", use: "Risk and operational watchtower",
    bestFor: "Continuous business monitoring, anomaly detection, operational alerts and predictive risk intelligence." },
  { name: "ORBIT", tagline: "Your Entire Enterprise. One Intelligent View.", identity: "Business 360° visibility", use: "Executive simulation",
    bestFor: "A 360-degree business simulation that unifies financial, operational and strategic performance." },
  { name: "SYNAPSE", tagline: "Connecting Data. Activating Intelligence.", identity: "Agentic AI orchestration", use: "Multi-agent decision system",
    bestFor: "Showing how AI agents and business functions connect to produce coordinated decisions." },
  { name: "PULSE", tagline: "The Real-Time Intelligence of Your Business.", identity: "Real-time business health", use: "CEO dashboard",
    bestFor: "Executive KPI monitoring, live business health, performance trends and operational insights." },
  { name: "FORESIGHT", tagline: "Predict Tomorrow. Decide Today.", identity: "Predictive decision intelligence", use: "What-if business simulations",
    bestFor: "Predictive analytics, what-if simulation, scenario planning and AI-driven recommendations." },
];

export const nexusRow = { name: "NEXUS", identity: "Connected enterprise intelligence", use: "Enterprise-wide command centre" };
