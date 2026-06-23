import type { AIModel } from "@/lib/types";

const MODEL_RATES: Record<string, number> = {
  "GPT-4o mini": 0.0000015,
  "Claude 3.5 Haiku": 0.000001,
};

const RESPONSE_TEMPLATES = [
  (prompt: string) =>
    `**Analysis Summary**\n\nBased on your input, here are the key findings:\n\n1. **Primary issue identified:** Operational inefficiency related to the described scenario\n2. **Recommended actions:** Review current process, implement standardized checklist, schedule follow-up within 48 hours\n3. **Risk factors:** Ensure all safety protocols are followed before implementing changes\n\n*This response was generated from your prompt (${prompt.length} characters) using manufacturing best practices. Always validate recommendations with your subject matter experts.*`,

  (prompt: string) =>
    `**Manufacturing Workflow Response**\n\n**Context processed:** ${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}\n\n**Structured output:**\n- Category A: Process optimization opportunities\n- Category B: Quality control checkpoints\n- Category C: Safety considerations\n\n**Next steps:** Document findings, share with shift lead, and track outcomes in your internal systems.`,

  (prompt: string) =>
    `**Draft Output**\n\nI've analyzed your manufacturing scenario and prepared the following:\n\n**Summary:** The described situation suggests a need for cross-functional review.\n\n**Hypotheses (for investigation):**\n1. Equipment-related factors\n2. Material or supply chain factors\n3. Process method variations\n\n**Caution:** These are starting points only. Confirm with actual production data before taking action.\n\n*Prompt length: ~${Math.round(prompt.length / 4)} tokens estimated.*`,
];

function hashPrompt(prompt: string): number {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash + prompt.charCodeAt(i) * (i + 1)) % RESPONSE_TEMPLATES.length;
  }
  return hash;
}

export interface MockAIResult {
  response_text: string;
  token_estimate: number;
  cost_estimate: number;
}

export async function runMockAI(
  model: AIModel,
  prompt: string,
): Promise<MockAIResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const template = RESPONSE_TEMPLATES[hashPrompt(prompt)];
  const response_text = template(prompt);
  const token_estimate = Math.round((prompt.length + response_text.length) / 4);
  const rate = MODEL_RATES[model.name] ?? 0.000001;
  const cost_estimate = Math.round(token_estimate * rate * 10000) / 10000;

  return { response_text, token_estimate, cost_estimate };
}
