/**
 * Shared types for the landing page components
 */

export interface ButtonVariant {
  variant?: "primary" | "secondary" | "ghost";
}

export interface SimulationState {
  dataset: number;
  auditRatio: number;
  storageSaved: number;
  estimatedRetrievalMs: number;
}

export interface DemoHandlers {
  handleWhitePaper: () => void;
  handleDemo: () => void;
  handlePilot: () => void;
}
